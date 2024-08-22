from collections import defaultdict
from typing import List, cast

import numpy as np
from bidict import bidict
from omegaconf import OmegaConf

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
    node_category2ids: dict[str, list[str]],
    promoter_controlling_proteins: dict[str, list[str]],
) -> tuple[np.ndarray, bidict]:
    """Build protein interaction graph from GUI circuit with promoter controlling information.

    Args:
        all_nodes (dict[str, GUINode]): all nodes in the circuit converted to GUINode format.
        node_category_dict (dict[str, list[str]]): dict of nodes for each node category.
            dict: {node_category: [node_id]}.
            node_category: 'protein', 'promoter', 'terminator'
        promoter_controlling_proteins (dict[str, list[str]]): dict of connected protein node id for each promoter node.

    Returns:
        protein_interact_graph: np.ndarray: directed graph of protein interaction converted from GUI circuit.
            protein_interact_graph[i][j] = 1 or -1 or 0. value means how protein-i control to protein-j
            shape=(num_protein, num_protein)
        proteinIn_idx_bidict: bidict[str, int]:
            relation between idx and protein node in protein_interact_graph with bidict.
    """
    partsId_to_nodeIds = create_partsId_nodeId_table(all_nodes)
    proteinId_idx_bidict = bidict({node_id: idx for idx, node_id in enumerate(node_category2ids['protein'])})
    protein_interaction_graph: np.ndarray = np.empty(
        (len(node_category2ids['protein']), len(node_category2ids['protein']))
    )

    for idx, protein_nodeId in enumerate(node_category2ids['protein']):
        controlTo_info_list = all_nodes[protein_nodeId].controlTo
        if controlTo_info_list is None:  # np.empty asigns 0 to the array defaultly.
            continue
        else:
            # retyping from dict[str,float]| None to dict[str,float] for mypy type checking.
            controlTo_info_list = cast(dict[str, dict[str, str]], controlTo_info_list)
        protein_interaction = get_protein_interaction(
            controlTo_info_list, promoter_controlling_proteins, partsId_to_nodeIds
        )
        for interact_protein_id, interaction_info in protein_interaction.items():
            protein_interaction_graph[idx, proteinId_idx_bidict[interact_protein_id]] = interaction_info

    return protein_interaction_graph, proteinId_idx_bidict


def run_convert(raw_circuit_data: OmegaConf) -> tuple[np.ndarray, bidict, dict[str, GUINode]]:
    """Convert GUI circuit data to protein interaction graph.

    Args:
        raw_circuit_data (OmegaConf): circuit data send from GUI frontend. OmegaConf format.

    Returns:
        protein_interact_graph (np.ndarray): directed graph of protein interaction converted from GUI circuit.
            protein_interact_graph[i][j] = 1 or -1 or 0. value means how protein-i control to protein-j
        proteinId_idx_bidict (bidict[str, int]):
            relation between idx and protein node in protein_interact_graph with bidict.
        all_nodes (dict[str, GUINode]): all nodes in the circuit converted to GUINode format.
    """
    all_nodes, node_category2ids = parse_all_nodes(raw_circuit_data.nodes)
    promoter_controlling_proteins = parse_edge_connection(raw_circuit_data.edges, all_nodes)
    protein_interact_graph, proteinId_idx_bidict = build_protein_interact_graph(
        all_nodes, node_category2ids, promoter_controlling_proteins
    )

    assert protein_interact_graph.shape == (len(proteinId_idx_bidict), len(proteinId_idx_bidict))
    assert np.isin(protein_interact_graph, [0, 1, -1]).all()

    return protein_interact_graph, proteinId_idx_bidict, all_nodes


def get_parts_name_list(proteinId_idx_bidict: bidict, all_nodes: dict[str, GUINode]) -> list[str]:
    """Get parts name list to display in the Simulator frontend.

    Args:
        proteinId_idx_bidict (bidict):
            relation between idx and protein node in protein_interact_graph with bidict.
        all_nodes (dict[str, GUINode]):
            all nodes in the circuit converted to GUINode format.

    Returns:
        parts_name_list (list[str]): list of parts name. If there are multiple same parts name, add number to the name.
    """
    parts_name_count = defaultdict(int)
    parts_name_list = []

    for protein_id in proteinId_idx_bidict.keys():
        protein_node = all_nodes.get(protein_id)
        parts_name = protein_node.nodePartsName

        parts_name_count[parts_name] += 1
        if parts_name_count[parts_name] > 1:
            parts_name_list.append(f'{parts_name}_{parts_name_count[parts_name]}')
        else:
            parts_name_list.append(parts_name)

    return parts_name_list
