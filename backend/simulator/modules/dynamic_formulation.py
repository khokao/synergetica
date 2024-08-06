# ruff: noqa: F821
# skip undefined name error for dynamic function generation.
import numpy as np
from bidict import bidict

from simulator.core.schema import GUINode


class ODEBuilder:
    def __init__(self) -> None:
        self.PCN = 15  # plasmid copy number. unit = [copy/cell]
        self.Dmrna = 0.012  # mRNA degradation rate. unit = [1/s]
        self.Emrna = 1  # transcription rate or mRNA. unknown # TODO: determine thie value
        self.Erpu = 1  # TODO: determine thie value

    def PRS_str(self, params: dict[str, float] | None, var_idx: int, control_type: int) -> str:
        """build PRS equation as a string.
        Args:
            params (dict[str, float]): parameters for PRS equation.
                e.g) {'Ymax': 1, 'Ymin': 0, 'n': 2, 'K': 0.5, 'Pmax': 1}
            var_idx (int): index of the target protein.
            control_type (int): control type of the target protein.
                1: activation, -1: repression
        Returns:
            prs (str): PRS equation as a string.
        """
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
        """build mRNA ODE equation as a string.

        Args:
            idx (int): protein index in the protein_interaction_graph.
            interact_infos (np.ndarray): array of interaction info for the target protein. 1 or -1 or 0.
            proteinId_idx_bidict (bidict[str, int]): bidict of relation between protein node ID and index.
            all_nodes (dict[str, GUINode]): all node information in the GUI circuit.

        Returns:
            mrna_ode_str (str): mRNA ODE equation as a string.
        """
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
        """build protein ODE equation as a string.

        Args:
            idx (int): protein index in the protein_interaction_graph.
            proteinId_idx_bidict (bidict[str, int]): bidict of relation between protein node ID and index.
            all_nodes (dict[str, GUINode]): all node information in the GUI circuit.

        Returns:
            protein_ode_str (str): protein ODE equation as a string.
        """
        own_params = all_nodes[proteinId_idx_bidict.inverse[idx]].meta
        protein_ode_left = f'd{idx*2+1}dt'
        protein_ode_right = f'{self.Erpu} * TIR{2*idx+1} * var[{idx*2}] - {own_params['Dp']} * var[{idx*2+1}]'
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
            interact_infos (np.ndarray):  array of interaction info for the target protein. 1 or -1 or 0.
            idx (int): protein index in the protein_interaction_graph.
            proteinId_idx_bidict (bidict[str, int]): bidict of relation between protein node ID and index.
            all_nodes (dict[str, GUINode]): all node information in the GUI circuit.

        Returns:
            ode (str): string ODE equation for the target protein. It contains mRNA and protein equations.
        """

        if np.all(interact_infos == 0):
            # if there is no interaction for the protein,
            # the ode for the protein is "d[x]/dt = α_x - d_x * [x]"
            ode = 'None'  # TODO: determine the equation when there is no interaction
        else:
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
        all_nodes (dict[str, GUINode]): all nodes in the GUI circuit converted to GUINode format.

    Returns:
        function_str (str): ODE function as a string.
    """
    ode_builder = ODEBuilder()

    def_str = 'def ODEtoSolve(var:list[float],t:float,'
    all_ode_str = ''
    return_str = 'return ('

    for idx, interact_infos in enumerate(protein_interact_graph):
        def_str += f'TIR{2*idx+1}:float,'
        ode_str = ode_builder.make_each_ode(interact_infos, idx, proteinId_idx_bidict, all_nodes)
        all_ode_str += ode_str
        return_str += f'd{idx*2}dt, d{idx*2+1}dt,'

    def_str = def_str[:-1] + '):\n'
    return_str = return_str[:-1] + ')'
    function_str = def_str + all_ode_str + f'\t{return_str}'

    return function_str
