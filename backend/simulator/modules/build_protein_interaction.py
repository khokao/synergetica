from collections import defaultdict
from typing import List, cast

import numpy as np
from omegaconf.dictconfig import DictConfig

from simulator.core.schema import GUINode
from simulator.modules.parse_gui_graph import (
    create_partsId_nodeId_table,
    parse_all_nodes,
    parse_edge_connection,
)

CONTROL_TYPE_STR2INT = {
    'Repression': -1,
    'Activation': 1,
}


def search_interaction_through_promoter(
    promoter_partsId: str,
    control_details: str,
    promoter_controlling_proteins: dict[str, List[str]],
    partsId_to_nodeIds: dict[str, list[str]],
) -> dict[str, int]:
    """
    assign interactions (int value) for controlled proteins by the given promoter.

    Args:
        promoter_id (str): partsId of the promoter.
        control_details (dict[str, str]): Control information for the promoter.
        promoter_controlling_proteins (dict[str, List[str]]): Dictionary of connected protein node_ids for each promoter
        partsId_to_nodeId (dict[str, List[str]]): Dictionary to convert parts names to node IDs.

    Returns:
        protein_interaction (dict[str, int]): Interactions for controlled proteins. {protein_id: interaction}
    """
    protein_interaction = {}
    promoter_nodeIds = partsId_to_nodeIds.get(promoter_partsId, [])
    for promoter_nodeId in promoter_nodeIds:
        for controlled_protein_id in promoter_controlling_proteins.get(promoter_nodeId, []):
            interaction = CONTROL_TYPE_STR2INT[control_details]
            protein_interaction[controlled_protein_id] = interaction
    return protein_interaction


def get_protein_interaction(
    controlTo_info_list: list[dict[str, str]],
    promoter_controlling_proteins: dict[str, list[str]],
    partsId_to_nodeIds: dict[str, list[str]],
) -> dict[str, int]:
    """get all interacting protein_nodes and how interact for the given protein.

    Args:
        controlTo_info (list[dict[str, str]]): Information about which promoters the protein controls.
            e.g)[{'partsId': '3aa865db07b14c56e1a95166d36b27819cacf657d350d8b85fb3b88e74d04f3c',
                  'controlType': 'Repression',}]
        promoter_controlling_proteins (dict[str, list[str]]): dict of connected protein node_id for each promoter node.
        partsId_to_nodeIds (dict[str,list[str]]): dict to convert parts_name to node_id.
                                                   There can be multiple node_id for one parts_name.
            dict: {nodePartsName:list[node_id]}

    Returns:
        protein_interaction (dict[str,int]): {protein_node_id: (1 or -1)}
    """
    protein_interaction = {}
    for controlTo_info in controlTo_info_list:
        promoter_id = controlTo_info['partsId']
        control_details = controlTo_info['controlType']
        interaction = search_interaction_through_promoter(
            promoter_id, control_details, promoter_controlling_proteins, partsId_to_nodeIds
        )
        protein_interaction.update(interaction)
    return protein_interaction


def build_protein_interact_graph(
    all_nodes: dict[str, GUINode],
    promoter_controlling_proteins: dict[str, list[str]],
) -> tuple[np.ndarray, list[str]]:
    """Build protein interaction graph from GUI circuit with promoter controlling information.

    Args:
        all_nodes (dict[str, GUINode]): all nodes in the circuit converted to GUINode format.
        promoter_controlling_proteins (dict[str, list[str]]): dict of connected protein node id for each promoter node.

    Returns:
        protein_interact_graph: np.ndarray: directed graph of protein interaction converted from GUI circuit.
            protein_interact_graph[i][j] = 1 or -1 or 0. value means how protein-i control to protein-j
            shape=(num_protein, num_protein)
        proteinId_list (list[str]): list of protein Id. idx of the list is the idx of protein in protein_interact_graph.
    """
    partsId_to_nodeIds = create_partsId_nodeId_table(all_nodes)
    proteinId_list = [nodeId for nodeId, node in all_nodes.items() if node.nodeCategory == 'protein']
    protein_interaction_graph: np.ndarray = np.zeros((len(proteinId_list), len(proteinId_list)))

    for idx, protein_nodeId in enumerate(proteinId_list):
        controlTo_info_list = all_nodes[protein_nodeId].controlTo
        if controlTo_info_list is None:
            continue
        else:
            controlTo_info_list = cast(list[dict[str, str]], controlTo_info_list)
        protein_interaction = get_protein_interaction(
            controlTo_info_list, promoter_controlling_proteins, partsId_to_nodeIds
        )
        for interact_protein_id, interaction_info in protein_interaction.items():
            protein_interaction_graph[idx, proteinId_list.index(interact_protein_id)] = interaction_info

    return protein_interaction_graph, proteinId_list


def run_convert(raw_circuit_data: DictConfig) -> tuple[np.ndarray, list[str], dict[str, GUINode]]:
    """Convert GUI circuit data to protein interaction graph.

    Args:
        raw_circuit_data (OmegaConf): circuit data send from GUI frontend. OmegaConf format.

    Returns:
        protein_interact_graph (np.ndarray): directed graph of protein interaction converted from GUI circuit.
            protein_interact_graph[i][j] = 1 or -1 or 0. value means how protein-i control to protein-j
        proteinId_list (list[str]): list of protein Id. idx of the list is the idx of protein in protein_interact_graph.
        all_nodes (dict[str, GUINode]): all nodes in the circuit converted to GUINode format.
    """
    all_nodes = parse_all_nodes(raw_circuit_data.nodes)
    promoter_controlling_proteins = parse_edge_connection(raw_circuit_data.edges, all_nodes)
    protein_interact_graph, proteinId_list = build_protein_interact_graph(all_nodes, promoter_controlling_proteins)
    assert protein_interact_graph.shape == (len(proteinId_list), len(proteinId_list))
    assert np.isin(protein_interact_graph, [0, 1, -1]).all()

    return protein_interact_graph, proteinId_list, all_nodes


def get_protein_nameId_dict(proteinId_list: list[str], all_nodes: dict[str, GUINode]) -> dict[str, str]:
    """Get protein parts name list to display in the Simulator frontend.

    Args:
        proteinId_list (list[str]): dict of protein Id. idx of the list is the idx of protein in protein_interact_graph.
        all_nodes (dict[str, GUINode]): all nodes in the circuit converted to GUINode format.

    Returns:
        parts_nameId_dict (dict[str,str]): list of parts name. If there are multiple same parts name, add number to the name.
    """
    parts_name_count: defaultdict[str, int] = defaultdict(int)
    protein_nameId_dict = {}

    for protein_id in proteinId_list:
        protein_node = all_nodes[protein_id]
        parts_name = protein_node.nodePartsName

        parts_name_count[parts_name] += 1
        if parts_name_count[parts_name] > 1:
            protein_nameId_dict[protein_id] = f'{parts_name}_{parts_name_count[parts_name]}'
        else:
            protein_nameId_dict[protein_id] = parts_name

    return protein_nameId_dict
