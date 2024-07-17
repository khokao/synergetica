import numpy as np
from omegaconf import OmegaConf
from pydantic import BaseModel


class GUINode(BaseModel):
    id: str
    nodeCategory: str
    nodeSubcategory: str
    nodePartsName: str
    sequence: str
    controlTo: dict | None
    controlBy: dict | None


def parse_all_nodes(nodes: list[dict[str, str]]) -> (dict[str, GUINode], dict[str, list[str]]):
    """Parse and convert all nodes from GUI into GUINode.

    Args:
        nodes (list[dict[str, str]]): node info output from GUI section.

    Returns:
        all_nodes (dict[str,GUINode]): all nodes in the circuit converted to GUINode format.
            dict: {node_id: GUINode}
        node_category_dict (dict[str, list[str]]): dict of nodes for each node category.
            dict: {node_category: [node_id]}.
            node_category: 'protein', 'promoter', 'terminator'
    """
    node_category_dict: dict[str, list] = {'protein': [], 'promoter': [], 'terminator': []}
    all_nodes: dict = {}
    for node in nodes:
        if node['type'] == 'child':
            node_info: dict = {
                'id': node.id,
                'nodeCategory': node.data.nodeCategory,
                'nodeSubcategory': node.data.nodeSubcategory,
                'nodePartsName': node.data.nodePartsName,
                'sequence': node.data.sequence,
                'controlTo': node.data.controlTo,
                'controlBy': node.data.controlBy,
            }
            all_nodes[node.id] = GUINode(**node_info)
            node_category_dict[node.data.nodeCategory].append(node.id)
    return all_nodes, node_category_dict


def dfs(node: int, visited: set, adj_matrix: np.ndarray) -> None:
    """depth first search algorithm to find all connected nodes.

    Args:
        node (int): index of the node to start the search.
        visited (set): set of log visited node index.
        adj_matrix (np.ndarray): adjacency matrix of the GUI graph.
    """
    num_nodes: int = len(adj_matrix)
    for j in range(num_nodes):
        if adj_matrix[node][j] != 0 and j not in visited:
            visited.add(j)
            dfs(j, visited, adj_matrix)


def get_all_connected_nodes(adj_matrix: np.ndarray) -> list[list[int]]:
    """get node connection for all nodes in the GUI graph.

    Args:
        adj_matrix (np.ndarray): adjacency matrix of the GUI graph.

    Returns:
        all_connected_node_idx (list[list[int]]): list of connected nodes idx for each node.
            len(all_connected_nodes) = num_nodes
    """
    num_nodes: int = len(adj_matrix)
    all_connected_node_idx: list = []

    for i in range(num_nodes):
        visited = set()
        dfs(i, visited, adj_matrix)
        all_connected_node_idx.append(list(visited))

    return all_connected_node_idx


def extract_promoter_nodes(
    all_connected_node_idx: list[list[int]], all_nodes: dict[str, GUINode], idx_to_nodeId_table: dict[int, str]
) -> dict[str, list[str]]:
    """Extract only promoter nodes from all_connected_nodes and convert idx to node_id.

    Args:
        all_connected_node_idx (list[list[int]]): list of connected node index for each node.
            len(all_connected_node_idx) = num_nodes
        all_nodes (dict[str, GUINode]): all nodes in the circuit converted to GUINode format.
        idx_to_nodeId_table (dict[int, str]): dict to convert idx to node_id.

    Returns:
        promoter_controlling_proteins (dict[str, list[str]]): dict of connected protein node id for each promoter node.
            dict: {promoter_node_id: [protein_node_id]}
    """
    promoter_controlling_proteins: dict = {}
    for idx, connected_nodes in enumerate(all_connected_node_idx):
        node_id: str = idx_to_nodeId_table[idx]
        if all_nodes[node_id].nodeCategory == 'promoter':
            controlled_protein: list = []
            for idx in connected_nodes:
                if all_nodes[idx_to_nodeId_table[idx]].nodeCategory == 'protein':
                    controlled_protein.append(idx_to_nodeId_table[idx])
            promoter_controlling_proteins[node_id] = controlled_protein
    return promoter_controlling_proteins


def parse_edge_connection(edges: list[dict], all_nodes: dict[str, GUINode]) -> dict[str, list[str]]:
    """list up under controled protein for each promoter

    Args:
        edges (list[dict]): edge info POST from GUI section.
        all_nodes (dict[str, GUINode]): all nodes in the circuit converted to GUINode format.

    Returns:
        dict[str, list[str]]: dict of connected protein node id for each promoter node.
    """
    nodeId_to_idx_table: dict = {node: idx for idx, node in enumerate(all_nodes)}
    idx_to_nodeId_table: dict[int, str] = dict(enumerate(all_nodes))
    graph: np.ndarray = np.zeros((len(all_nodes), len(all_nodes)))

    # create all GUI node graph as a first step.
    # graph G[i][j]=1 means i->j edge exists.
    for edge in edges:
        source_idx: int = nodeId_to_idx_table[edge.source]
        target_idx: int = nodeId_to_idx_table[edge.target]
        graph[source_idx, target_idx] = 1

    all_connected_node_idx: list[list[int]] = get_all_connected_nodes(graph)
    return extract_promoter_nodes(all_connected_node_idx, all_nodes, idx_to_nodeId_table)


def get_protein_interaction(
    control_info: dict[str, dict[str, str]], promoter_controling_proteins, partsName_to_id
) -> dict[str, int]:
    """get interacting infomation in between protein nodes with promoter controling information.

    Args:
        control_info (dict[str,dict[str,str]]): controling info for each promoter node.
            dict: {part_name:{controlType:controlType}}
        promoter_controling_proteins (dict[str, list[str]]): dict of connected protein node id for each promoter node.
        partsName_to_id (dict[str,int]): dict to convert parts_name to node_id. {nodePartsName:node_id}

    Returns:
        interact_proteins (dict[str,int]): {protein_id:1 or -1}
    """
    interact_proteins: dict = {}
    for promoter_name, how_control in control_info.items():
        promoter_id: str = partsName_to_id[promoter_name]
        for controlled_protein_id in promoter_controling_proteins[promoter_id]:
            if how_control.controlType == 'Repression':
                interact_proteins[controlled_protein_id] = -1
            elif how_control.controlType == 'Activation':
                interact_proteins[controlled_protein_id] = 1

    return interact_proteins


def build_protein_interact_graph(
    all_nodes: dict[str, GUINode],
    node_category_dict: dict[str, list[str]],
    promoter_controling_proteins: dict[str, list[str]],
) -> (np.ndarray, dict[str, int]):
    """Build protein interaction graph from GUI circuit

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
        proteinIn_to_idx: dict[str, int]: relation between idx and protein node in protein interact_graph.
    """
    partsName_to_nodeId: dict[str, str] = {all_nodes[node_id].nodePartsName: node_id for node_id in all_nodes}
    proteinId_to_idx: dict[str, int] = {node_id: idx for idx, node_id in enumerate(node_category_dict['protein'])}
    protein_interaction_graph: np.ndarray = np.zeros(
        (len(node_category_dict['protein']), len(node_category_dict['protein']))
    )

    for idx, protein_node_id in enumerate(node_category_dict['protein']):
        control_info: dict[str, dict[str, str]] = all_nodes[protein_node_id].controlTo
        protein_interactions: dict[str, int] = get_protein_interaction(
            control_info, promoter_controling_proteins, partsName_to_nodeId
        )
        for interact_protein_id, interaction_type in protein_interactions.items():
            protein_interaction_graph[idx, proteinId_to_idx[interact_protein_id]] = interaction_type

    return protein_interaction_graph, proteinId_to_idx


def run_interpret():
    circuit = OmegaConf.load('toggle_output_test.json')
    all_nodes, node_category_dict = parse_all_nodes(circuit.nodes)
    promoter_controlling_proteins: dict[str, list[str]] = parse_edge_connection(circuit.edges, all_nodes)

    return build_protein_interact_graph(all_nodes, node_category_dict, promoter_controlling_proteins)
