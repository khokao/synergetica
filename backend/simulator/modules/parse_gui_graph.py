from collections import defaultdict

import numpy as np
from omegaconf.listconfig import ListConfig

from simulator.core.schema import GUINode


def parse_all_nodes(nodes: ListConfig) -> tuple[dict[str, GUINode], dict[str, list[str]]]:
    """Parse and convert all nodes from GUI into GUINode.

    Args:
        nodes (ListConfig): node information output from GUI section.

    Returns:
        all_nodes (dict[str,GUINode]): all nodes in the GUI circuit converted to GUINode format.
            dict: {node_id: GUINode}
    """
    all_nodes = {}
    for node in nodes:
        if node['type'] == 'child':
            node_info = {
                'id': node.id,
                'nodeCategory': node.data.nodeCategory,
                'nodeSubcategory': node.data.nodeSubcategory,
                'nodePartsName': node.data.nodePartsName,
                'sequence': node.data.sequence,
                'partsId': node.data.partsId,
                'controlTo': node.data.controlTo,
                'controlBy': node.data.controlBy,
                'meta': node.data.meta,
            }
            all_nodes[node.id] = GUINode(**node_info)

    return all_nodes


def create_partsId_nodeId_table(all_nodes: dict[str, GUINode]) -> dict[str, list[str]]:
    """Create partsName to nodeId table for all nodes in the GUI circuit.

    Args:
        all_nodes (dict[str, GUINode]): all nodes in the GUI circuit converted to GUINode format.

    Returns:
        partsId_to_nodeIds: dict[str, list[str]]: dict of node_id for each partsName.
            dict: {nodePartsName: [node_id]}
    """
    partsName_to_nodeIds_default = defaultdict(list)
    for node in all_nodes.values():
        partsName_to_nodeIds_default[node.partsId].append(node.id)

    partsName_to_nodeIds = dict(partsName_to_nodeIds_default)
    return partsName_to_nodeIds


def dfs(node: int, visited: set, adj_matrix: np.ndarray) -> None:
    """depth first search algorithm to find all connected nodes.

    Args:
        node (int): index of the node to start the search.
        visited (set): set of log visited node index.
        adj_matrix (np.ndarray): adjacency matrix of the GUI graph.
    """
    num_nodes = len(adj_matrix)
    for j in range(num_nodes):
        if adj_matrix[node][j] != 0 and j not in visited:
            visited.add(j)
            dfs(j, visited, adj_matrix)


def get_all_connected_nodes(adj_matrix: np.ndarray) -> list[list[int]]:
    """get node connection for all nodes in the GUI graph.
    Args:
        adj_matrix (np.ndarray): adjacency matrix of the GUI graph. values = 0 or 1.
            shape=(num_nodes, num_nodes)
    Returns:
        all_connected_node_idx (list[list[int]]): list of connected nodes idx for each node.
            len(all_connected_nodes) = num_nodes
    """
    num_nodes = len(adj_matrix)
    all_connected_node_idx: list = []

    for i in range(num_nodes):
        visited: set[int] = set()
        dfs(i, visited, adj_matrix)
        all_connected_node_idx.append(list(visited))

    return all_connected_node_idx


def extract_promoter_nodes(
    all_connected_node_idx: list[list[int]], all_nodes: dict[str, GUINode]
) -> dict[str, list[str]]:
    """Extract only promoter nodes from all_connected_nodes and convert idx to node_id.

    Args:
        all_connected_node_idx (list[list[int]]): list of connected node index for each node.
            len(all_connected_node_idx) = num_nodes
        all_nodes (dict[str, GUINode]): all nodes in the circuit converted to GUINode format.

    Returns:
        promoter_controlling_proteins (dict[str, list[str]]): dict of connected protein node_id for each promoter node.
            dict: {promoter_node_id: [protein_node_id]}
    """
    idx_to_nodeId_table = dict(enumerate(all_nodes))
    promoter_controlling_proteins = {}

    for i, connected_nodes in enumerate(all_connected_node_idx):
        node_id = idx_to_nodeId_table[i]
        if all_nodes[node_id].nodeCategory == 'promoter':
            controlled_protein = []
            for j in connected_nodes:
                if all_nodes[idx_to_nodeId_table[j]].nodeCategory == 'protein':
                    controlled_protein.append(idx_to_nodeId_table[j])
            promoter_controlling_proteins[node_id] = controlled_protein
    return promoter_controlling_proteins


def parse_edge_connection(edges: ListConfig, all_nodes: dict[str, GUINode]) -> dict[str, list[str]]:
    """list up under controlled proteins for each promoter

    Args:
        edges (list[dict]): edge information of  GUI circuit.
        all_nodes (dict[str, GUINode]): all nodes in the circuit converted to GUINode format.

    Returns:
        dict[str, list[str]]: dict of connected protein node id for each promoter node.
    """
    nodeId_to_idx_table = {node: idx for idx, node in enumerate(all_nodes)}
    graph: np.ndarray = np.zeros((len(all_nodes), len(all_nodes)))

    # create all GUI node graph as a first step.
    # graph G[i][j]=1 means i->j edge exists.
    for edge in edges:
        source_idx = nodeId_to_idx_table[edge.source]
        target_idx = nodeId_to_idx_table[edge.target]
        graph[source_idx, target_idx] = 1

    all_connected_node_idx = get_all_connected_nodes(graph)
    return extract_promoter_nodes(all_connected_node_idx, all_nodes)
