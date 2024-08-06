# ruff: noqa: F821
# skip undefined name error for dynamic function generation.
import numpy as np
from bidict import bidict

from simulator.core.schema import GUINode


class ODEBuilder:
    def __init__(self):
        self.PCN = 15  # plasmid copy number. unit = [copy/cell]
        self.Dmrna = 0.012  # mRNA degradation rate. unit = [1/s]
        self.Emrna = 1  # transcription rate or mRNA. unknown # TODO: determine thie value
        self.Erpu = 1  # TODO: determine thie value
        self.TIR = 1  # TODO: determine thie value

    def PRS_str(self, params: dict[str, float], var_idx: int, control_type: int):
        if control_type == 1:
            prs = f"""(({params['Ymax']} + (({params['Ymax']}-{params['Ymin']}) *  var[{var_idx}] ** {params['n']}) / ( var[{var_idx}] ** {params['n']} + {params['K']} ** {params['n']})) / {params['Ymax']})"""  # noqa: E501
        elif control_type == -1:
            prs = f"""(({params['Ymax']} + (({params['Ymax']}-{params['Ymin']}) * {params['K']} ** {params['n']}) / ( var[{var_idx}] ** {params['n']} + {params['K']} ** {params['n']})) / {params['Ymax']})"""  # noqa: E501
        return prs.replace('\n', '')

    def make_mrna_ode(
        self,
        idx: int,
        interact_infos: np.ndarray,
        proteinId_idx_bidict: bidict[str, int],
        all_nodes: dict[str, GUINode],
    ) -> str:
        prs = ''
        for j, interact_info in enumerate(interact_infos):
            if interact_info == 0:
                continue
            else:
                interact_params = all_nodes[proteinId_idx_bidict.inverse[j]].meta
                protein_idx = 2 * j + 1
                prs += self.PRS_str(interact_params, var_idx=protein_idx, control_type=interact_info)
                prs += ' * '

        own_params = all_nodes[proteinId_idx_bidict.inverse[idx]].meta
        mrna_ode_right = f'{self.Emrna} * {own_params['Pmax']} * {prs} {self.PCN} - {self.Dmrna} * var[{idx*2}]'
        mrna_ode_left = f'd{idx*2}dt'
        mrna_ode_str = f'{mrna_ode_left} = {mrna_ode_right}'
        return mrna_ode_str

    def make_protein_ode(self, idx: int, proteinId_idx_bidict: bidict[str, int], all_nodes: dict[str, GUINode]) -> str:
        own_params = all_nodes[proteinId_idx_bidict.inverse[idx]].meta
        protein_ode_left = f'd{idx*2+1}dt'
        protein_ode_right = f'{self.Erpu} * {self.TIR} * var[{idx*2}] - {own_params['Dp']} * var[{idx*2+1}]'
        protein_ode_str = f'{protein_ode_left} = {protein_ode_right}'

        return protein_ode_str

    def make_each_ode(
        self,
        interact_infos: np.ndarray,
        idx: int,
        proteinId_idx_bidict: bidict[str, int],
        all_nodes: dict[str, GUINode],
    ) -> str:
        """
        Args:
            interact_info (np.ndarray): interaction info for the target protein. shape=(num_protein,)
                value: (1 or -1)

        Returns:
            ode (str): ode for the target protein entry.
                e.g) dudt = a1 / (1 + var[1] ** n) - var[0]
        """

        if np.all(interact_infos == 0):
            # if there is no interaction for the protein,
            # the ode for the protein is "d[x]/dt = α_x - d_x * [x]"
            ode = f'{params['a']} - {params['d']}*var[{i}]'  ## TODO: interactionがない場合の式を考える。
        else:
            # if there is interaction for the protein,
            # the ode for the protein becomes like "d[x]/dt = f(x1,x2,...,xn) - d_x * [x]".abs
            # the first term "f(x1,x2,...,xn)"" is the interaction term.
            # the second term "- d_x * [x]" is the degradation term.
            ode = ''
            mrna_ode_str = self.make_mrna_ode(idx, interact_infos, proteinId_idx_bidict, all_nodes)
            protein_ode_str = self.make_protein_ode(idx, proteinId_idx_bidict, all_nodes)

            ode += f'\t{mrna_ode_str}\n'
            ode += f'\t{protein_ode_str}\n'

        return ode


def build_function_as_str(
    protein_interact_graph: np.ndarray, proteinId_idx_bidict: bidict[str, int], all_nodes: dict[str, GUINode]
) -> str:
    """Build ODE function as a string to be defined by exec().

    Args:
        protein_interact_graph (np.ndarray): directed graph of protein interaction converted from GUI circuit.
            protein_interact_graph[i][j] = 1 or -1. how control protein-i to protein-j
        proteinId_idx_bidict (bidict.bidict[str,int]):
            relation between idx and protein node in protein_interact_graph with bidict.
        all_nodes (dict[str, GUINode]):  all_nodes (dict[str,GUINode]): all nodes in the GUI circuit converted to GUINode format.

    Returns:
        functino_str (str): ODE function as a string.
    """
    ode_builder = ODEBuilder()

    def_str = 'def ODEstoSolve(var:list[float],t:float): \n'
    # TODO:可変パラメータはこの段階で変数として定義して受け取れるようにする。
    all_ode_str = ''
    return_str = 'return ('
    for idx, interact_infos in enumerate(protein_interact_graph):
        ode_str = ode_builder.make_each_ode(interact_infos, idx, proteinId_idx_bidict, all_nodes)
        all_ode_str += ode_str
        return_str += f'd{idx*2}dt, d{idx*2+1}dt,'

    return_str = return_str[:-1] + ')'
    function_str = def_str + all_ode_str + f'\t{return_str}'

    return function_str
