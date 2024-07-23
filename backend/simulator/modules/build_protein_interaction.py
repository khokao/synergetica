import numpy as np
from omegaconf import OmegaConf

from simulator.core.schema import GUINode
from simulator.modules.parse_gui_graph import (
    create_partsName_nodeId_table,
    parse_all_nodes,
    parse_edge_connection,
)


def get_protein_interaction(
    control_info: dict[str, dict[str, str]], promoter_controling_proteins, partsName_to_nodeId
) -> dict[str, int]:
    """get interacting infomation in between protein nodes with promoter controling information.

    Args:
        control_info (dict[str,dict[str,str]]): controling info for each promoter node.
            dict: {part_name:{controlType:controlType}}
        promoter_controling_proteins (dict[str, list[str]]): dict of connected protein node_id for each promoter node.
        partsName_to_nodeId (dict[str,list[str]]): dict to convert parts_name to node_id.
            dict: {nodePartsName:list[node_id]}

    Returns:
        protein_interaction (dict[str,int]): {protein_id:1 or -1}
    """
    protein_interaction = {}
    for promoter_name, how_control in control_info.items():
        promoter_nodeIds = partsName_to_nodeId[promoter_name]
        for promoter_nodeId in promoter_nodeIds:
            for controlled_protein_id in promoter_controling_proteins[promoter_nodeId]:
                if how_control.controlType == 'Repression':
                    protein_interaction[controlled_protein_id] = -1
                elif how_control.controlType == 'Activation':
                    protein_interaction[controlled_protein_id] = 1

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
            shape=(num_protein, num_protein)
            value=1: activation, value=-1: repression, value=0: no interaction
        proteinIn_to_idx: dict[str, int]: relation between idx and protein node in protein_interact_graph.
    """
    partsName_to_nodeId = create_partsName_nodeId_table(all_nodes)
    proteinId_to_idx = {node_id: idx for idx, node_id in enumerate(node_category_dict['protein'])}
    protein_interaction_graph: np.ndarray = np.zeros(
        (len(node_category_dict['protein']), len(node_category_dict['protein']))
    )

    for idx, protein_nodeId in enumerate(node_category_dict['protein']):
        control_info = all_nodes[protein_nodeId].controlTo
        protein_interactions = get_protein_interaction(control_info, promoter_controling_proteins, partsName_to_nodeId)
        for interact_protein_id, interaction_type in protein_interactions.items():
            protein_interaction_graph[idx, proteinId_to_idx[interact_protein_id]] = interaction_type

    return protein_interaction_graph, proteinId_to_idx


def run_interpret():
    circuit = OmegaConf.load('toggle_output_test.json')  # TODO: change to take from simulator API.
    all_nodes, node_category_dict = parse_all_nodes(circuit.nodes)
    promoter_controlling_proteins = parse_edge_connection(circuit.edges, all_nodes)

    return build_protein_interact_graph(all_nodes, node_category_dict, promoter_controlling_proteins)
