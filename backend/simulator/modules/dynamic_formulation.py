# ruff: noqa: F821
# skip undefined name error for dynamic function generation.

import numpy as np
import numpy.typing as npt

from ..api.schemas import ReactFlowChildNodeData


class ODEBuilder:
    def __init__(self) -> None:
        self.PCN = 15  # plasmid copy number. unit = [copy/cell]
        self.Dmrna = 0.012145749  # mRNA degradation rate. unit = [1/s]
        self.Emrna = 300  # transcription coefficient
        self.Erpu = 0.01  # translation coefficient

    def PRS_str(self, params: dict[str, float], var_idx: int, control_type: int) -> str:
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
            prs = f"""(({params['Ymin']} + (({params['Ymax']}-{params['Ymin']}) *  var[{var_idx}] ** {params['n']}) / ( var[{var_idx}] ** {params['n']} + {params['K']} ** {params['n']})) / {params['Ymax']})"""  # noqa: E501
        elif control_type == -1:
            prs = f"""(({params['Ymin']} + (({params['Ymax']}-{params['Ymin']}) * {params['K']} ** {params['n']}) / ( var[{var_idx}] ** {params['n']} + {params['K']} ** {params['n']})) / {params['Ymax']})"""  # noqa: E501
        return prs.replace('\n', '')

    def make_mrna_ode(
        self,
        idx: int,
        interact_info_array: npt.NDArray[np.int_],
        protein_node_ids: list[str],
        node_id2data: dict[str, ReactFlowChildNodeData],
    ) -> str:
        """build mRNA ODE equation as a string.

        Args:
            idx (int): protein index in the protein_interaction_graph.
            interact_info_array (npt.NDArray[np.int_]): array of interaction info for the target protein. 1 or -1 or 0.
            protein_node_ids (list[str]): List of protein id.
                The list idx refers to the index of the protein in the protein_interact_graph.
            node_id2data (dict[str, ReactFlowChildNodeData]): Dict of node id to node data.

        Returns:
            mrna_ode_str (str): mRNA ODE equation as a string.
        """
        if np.all(interact_info_array == 0):
            prs = '1'
        else:
            prs = ''
            for j, interact_info in enumerate(interact_info_array):
                if interact_info == 0:
                    continue

                interact_params = node_id2data[protein_node_ids[j]].meta
                # retyping from dict[str,float]| None to dict[str,float] for mypy type checking.
                assert interact_params is not None, 'interaction is defined but parameters are not defined'
                # interact_params = cast(dict[str, float], interact_params)
                protein_idx = 2 * j + 1
                prs += self.PRS_str(interact_params, var_idx=protein_idx, control_type=interact_info)

        own_params = node_id2data[protein_node_ids[idx]].meta
        assert own_params is not None, 'protein parameters are not defined'
        mrna_ode_right = f'{self.Emrna} * {own_params['Pmax']} * {prs} * {self.PCN} - {self.Dmrna} * var[{idx*2}]'
        mrna_ode_left = f'd{idx*2}dt'
        mrna_ode_str = f'{mrna_ode_left} = {mrna_ode_right}'
        return mrna_ode_str

    def make_protein_ode(
        self, idx: int, protein_node_ids: list[str], node_id2data: dict[str, ReactFlowChildNodeData]
    ) -> str:
        """build protein ODE equation as a string.

        Args:
            idx (int): protein index in the protein_interaction_graph.
            proteinId_list (list[str]): List of protein id.
                The list idx refers to the index of the protein in the protein_interact_graph.
            node_id2data (dict[str, ReactFlowChildNodeData]): Dict of node id to node data.

        Returns:
            protein_ode_str (str): protein ODE equation as a string.
        """
        own_params = node_id2data[protein_node_ids[idx]].meta
        assert own_params is not None, 'protein parameters are not defined'
        protein_ode_left = f'd{idx*2+1}dt'
        protein_ode_right = f'{self.Erpu} * TIR{2*idx+1} * var[{idx*2}] - {own_params['Dp']} * var[{idx*2+1}]'
        protein_ode_str = f'{protein_ode_left} = {protein_ode_right}'

        return protein_ode_str

    def __call__(
        self,
        interact_info_array: npt.NDArray[np.int_],
        idx: int,
        protein_node_ids: list[str],
        node_id2data: dict[str, ReactFlowChildNodeData],
    ) -> str:
        """

        Args:
            interact_info_array (npt.NDArray[np.int_]):  array of interaction info for the target protein. 1 or -1 or 0.
            idx (int): protein index in the protein_interaction_graph.
            protein_node_ids (list[str]): List of protein id.
                The list idx refers to the index of the protein in the protein_interact_graph.
            node_id2data (dict[str, ReactFlowChildNodeData]): Dict of node id to node data.

        Returns:
            ode (str): string ODE equation for the target protein. It contains mRNA and protein equations.
        """

        ode = ''
        mrna_ode_str = self.make_mrna_ode(idx, interact_info_array, protein_node_ids, node_id2data)
        protein_ode_str = self.make_protein_ode(idx, protein_node_ids, node_id2data)

        ode += f'\t{mrna_ode_str}\n'
        ode += f'\t{protein_ode_str}\n'

        return ode


def build_function_as_str(
    protein_interact_graph: np.ndarray, protein_node_ids: list[str], node_id2data: dict[str, ReactFlowChildNodeData]
) -> str:
    """Build ODE function as a string to be defined by exec().

    Args:
        protein_interact_graph (np.ndarray): directed graph of protein interaction converted from GUI circuit.
            protein_interact_graph[i][j] = 1 or -1. how control protein-i to protein-j
        protein_node_ids (list[str]): List of protein id.
            The list idx refers to the index of the protein in the protein_interact_graph.
        node_id2data (dict[str, ReactFlowChildNodeData]): Dict of node id to node data.

    Returns:
        function_str (str): ODE function as a string.
    """
    ode_builder = ODEBuilder()

    def_str = 'def ODEtoSolve(var:list[float],t:float,'
    all_ode_str = ''
    return_str = 'return ('

    for idx, interact_info_array in enumerate(protein_interact_graph):
        def_str += f'TIR{2*idx+1}:float,'
        ode_str = ode_builder(interact_info_array, idx, protein_node_ids, node_id2data)
        all_ode_str += ode_str
        return_str += f'd{idx*2}dt, d{idx*2+1}dt,'

    def_str = def_str[:-1] + '):\n'
    return_str = return_str[:-1] + ')'
    function_str = def_str + all_ode_str + f'\t{return_str}'

    return function_str
