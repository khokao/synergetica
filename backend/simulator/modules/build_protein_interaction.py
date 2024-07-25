from typing import List

import numpy as np
from omegaconf import OmegaConf

from simulator.core.schema import GUINode
from simulator.modules.parse_gui_graph import (
    create_partsName_nodeId_table,
    parse_all_nodes,
    parse_edge_connection,
)


def get_how_interact(how_control: str, controlled_protein_id: str) -> tuple(int, dict[str, float]):
    """
    Determine the interaction parameters based on the type of control.

    Args:
        how_control (str): Type of control (e.g., 'Repression' or 'Activation').
        controlled_protein_id (str): ID of the controlled protein.

    Returns:
        tuple(int, dict[str, float]): Interaction parameters, or None if the control type is not recognized.
    """
    if how_control == 'Repression':
        return (-1, {'param1': 1.0, 'param2': 2.0})
    elif how_control == 'Activation':
        return (1, {'param1': 2.0, 'param2': 1.0})
    else:
        raise ValueError(f'Control type {how_control} not recognized for protein {controlled_protein_id}')


def search_interaction_through_promoter(
    promoter_name: str,
    how_control: dict[str, str],
    promoter_controling_proteins: dict[str, List[str]],
    partsName_to_nodeId: dict[str, list[str]],
) -> dict[str, tuple[int, dict[str, float]]]:
    """
    Process the interactions for a given promoter.

    Args:
        promoter_name (str): Name of the promoter.
        how_control (dict[str, str]): Control information for the promoter.
        promoter_controling_proteins (dict[str, List[str]]): Dictionary of connected protein node_ids for each promoter.
        partsName_to_nodeId (dict[str, List[str]]): Dictionary to convert parts names to node IDs.

    Returns:
        dict[str, tuple[int, dict[str, float]]]: Interactions for controlled proteins.
    """
    protein_interaction = {}
    promoter_nodeIds = partsName_to_nodeId.get(promoter_name, [])
    for promoter_nodeId in promoter_nodeIds:
        for controlled_protein_id in promoter_controling_proteins.get(promoter_nodeId, []):
            interaction = get_how_interact(how_control.get('controlType', ''), controlled_protein_id)
            protein_interaction[controlled_protein_id] = interaction
    return protein_interaction


def get_protein_interaction(
    controlTo_info: dict[str, dict[str, str]], promoter_controling_proteins, partsName_to_nodeId
) -> dict[str, tuple[int, dict[str, float]]]:
    """get all interacting protein_nodes and how interact for the given protein.

    Args:
        controlTo_info (dict[str,dict[str,str]]): Information on which promoters the protein controls.
            dict: {part_name:{controlType:controlType}}
        promoter_controling_proteins (dict[str, list[str]]): dict of connected protein node_id for each promoter node.
        partsName_to_nodeId (dict[str,list[str]]): dict to convert parts_name to node_id.
                                                   There can be multiple node_id for one parts_name.
            dict: {nodePartsName:list[node_id]}

    Returns:
        protein_interaction (dict[str,tuple[int,dict[str,float]]]): {protein_id:(1,{'param1':2,'param2':1)})}
    """
    protein_interaction = {}
    for promoter_name, how_control in controlTo_info.items():
        interaction = search_interaction_through_promoter(
            promoter_name, how_control, promoter_controling_proteins, partsName_to_nodeId
        )
        protein_interaction.update(interaction)
    return protein_interaction


def build_protein_interact_graph(
    all_nodes: dict[str, GUINode],
    node_category_dict: dict[str, list[str]],
    promoter_controling_proteins: dict[str, list[str]],
) -> (np.ndarray, dict[str, int]):
    """Build protein interaction graph from GUI circuit with promoter controling information.

    Args:
        all_nodes (dict[str, GUINode]): all nodes in the circuit converted to GUINode format.
        node_category_dict (dict[str, list[str]]): dict of nodes for each node category.
            dict: {node_category: [node_id]}.
            node_category: 'protein', 'promoter', 'terminator'
        promoter_controling_proteins (dict[str, list[str]]): dict of connected protein node id for each promoter node.

    Returns:
        protein_interact_graph: np.ndarray: directed graph of protein interaction converted from GUI circuit.
            protein_interact_graph[i][j] = (1 or -1, {param:value}). how control protein-i to protein-j
            shape=(num_protein, num_protein)
        proteinIn_to_idx: dict[str, int]: relation between idx and protein node in protein_interact_graph.
    """
    partsName_to_nodeId = create_partsName_nodeId_table(all_nodes)
    proteinId_to_idx = {node_id: idx for idx, node_id in enumerate(node_category_dict['protein'])}
    protein_interaction_graph: np.ndarray = np.empty(
        (len(node_category_dict['protein']), len(node_category_dict['protein'])), dtype=object
    )

    for idx, protein_nodeId in enumerate(node_category_dict['protein']):
        controlTo_info = all_nodes[protein_nodeId].controlTo  # TODO: check schema of controlTo_info
        protein_interaction = get_protein_interaction(controlTo_info, promoter_controling_proteins, partsName_to_nodeId)
        for interact_protein_id, interaction_info in protein_interaction.items():
            protein_interaction_graph[idx, proteinId_to_idx[interact_protein_id]] = interaction_info

    return protein_interaction_graph, proteinId_to_idx


def run_interpret():
    circuit = OmegaConf.load('toggle_output_test.json')  # TODO: change to take from simulator API.
    all_nodes, node_category_dict = parse_all_nodes(circuit.nodes)
    promoter_controlling_proteins = parse_edge_connection(circuit.edges, all_nodes)

    return build_protein_interact_graph(all_nodes, node_category_dict, promoter_controlling_proteins)
