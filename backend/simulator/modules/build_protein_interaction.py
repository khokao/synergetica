from typing import List, cast

import numpy as np
from bidict import bidict
from omegaconf import OmegaConf

from simulator.core.schema import GUINode
from simulator.modules.parse_gui_graph import (
    create_partsName_nodeId_table,
    parse_all_nodes,
    parse_edge_connection,
)

CONTROL_TYPE_STR2INT = {
    'Repression': -1,
    'Activation': 1,
}


def search_interaction_through_promoter(
    promoter_name: str,
    control_details: dict[str, str],
    promoter_controlling_proteins: dict[str, List[str]],
    partsName_to_nodeId: dict[str, list[str]],
) -> dict[str, int]:
    """
    Process the interactions for a given promoter.

    Args:
        promoter_name (str): Name of the promoter.
        control_details (dict[str, str]): Control information for the promoter.
        promoter_controlling_proteins (dict[str, List[str]]): Dictionary of connected protein node_ids for each promoter
        partsName_to_nodeId (dict[str, List[str]]): Dictionary to convert parts names to node IDs.

    Returns:
        protein_interaction (dict[str, int]): Interactions for controlled proteins.
    """
    protein_interaction = {}
    promoter_nodeIds = partsName_to_nodeId.get(promoter_name, [])
    for promoter_nodeId in promoter_nodeIds:
        for controlled_protein_id in promoter_controlling_proteins.get(promoter_nodeId, []):
            interaction = CONTROL_TYPE_STR2INT[control_details['controlType']]
            protein_interaction[controlled_protein_id] = interaction
    return protein_interaction


def get_protein_interaction(
    controlTo_info: list[dict[str, str]],
    promoter_controlling_proteins: dict[str, list[str]],
    partsName_to_nodeId: dict[str, list[str]],
) -> dict[str, int]:
    """get all interacting protein_nodes and how interact for the given protein.

    Args:
        controlTo_info (dict[str,dict[str,str]]): Information on which promoters the protein controls.
            dict: {part_name:{controlType:controlType}}
        promoter_controlling_proteins (dict[str, list[str]]): dict of connected protein node_id for each promoter node.
        partsName_to_nodeId (dict[str,list[str]]): dict to convert parts_name to node_id.
                                                   There can be multiple node_id for one parts_name.
            dict: {nodePartsName:list[node_id]}

    Returns:
        protein_interaction (dict[str,int]): {protein_id: 1 or -1)}
    """
    protein_interaction = {}
    for promoter_name, control_details in controlTo_info.items():
        interaction = search_interaction_through_promoter(
            promoter_name, control_details, promoter_controlling_proteins, partsName_to_nodeId
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
            protein_interact_graph[i][j] = 1 or -1 or 0. how control protein-i to protein-j
            shape=(num_protein, num_protein)
        proteinIn_idx_bidict: bidict[str, int]:
            relation between idx and protein node in protein_interact_graph with bidict.
    """
    partsName_to_nodeId = create_partsName_nodeId_table(all_nodes)
    proteinId_idx_bidict = bidict({node_id: idx for idx, node_id in enumerate(node_category2ids['protein'])})
    protein_interaction_graph: np.ndarray = np.empty(
        (len(node_category2ids['protein']), len(node_category2ids['protein']))
    )

    for idx, protein_nodeId in enumerate(node_category2ids['protein']):
        controlTo_info = all_nodes[protein_nodeId].controlTo
        if controlTo_info is None:  # np.empty asigns 0 to the array defaultly.
            continue
        else:
            # retyping from dict[str,float]| None to dict[str,float] for mypy type checking.
            controlTo_info = cast(dict[str, dict[str, str]], controlTo_info)
        protein_interaction = get_protein_interaction(
            controlTo_info, promoter_controlling_proteins, partsName_to_nodeId
        )
        for interact_protein_id, interaction_info in protein_interaction.items():
            protein_interaction_graph[idx, proteinId_idx_bidict[interact_protein_id]] = interaction_info

    return protein_interaction_graph, proteinId_idx_bidict


def run_convert(raw_circuit_data: OmegaConf) -> tuple[np.ndarray, bidict, dict[str, GUINode]]:
    print(f'Raw circuit data: {raw_circuit_data}')
    all_nodes, node_category2ids = parse_all_nodes(raw_circuit_data.nodes)
    promoter_controlling_proteins = parse_edge_connection(raw_circuit_data.edges, all_nodes)
    protein_interact_graph, proteinId_idx_bidict = build_protein_interact_graph(
        all_nodes, node_category2ids, promoter_controlling_proteins
    )

    return protein_interact_graph, proteinId_idx_bidict, all_nodes
