from collections import defaultdict
from typing import Literal

import numpy as np

from ..api.schemas import ReactFlowChildNodeData, ReactFlowEdge

CONTROL_TYPE_STR2INT = {
    'repression': -1,
    'activation': 1,
}


def create_adjacency_matrix(edges: list[ReactFlowEdge], node_id2idx: dict[str, int]) -> np.ndarray:
    """Create an adjacency matrix from a list of edges and a node index mapping.

    Args:
        edges (list[ReactFlowEdge]): List of edges where each edge connects a source node to a target node.
        node_id2idx (dict[str, int]): Mapping from node ID to index for matrix construction.

    Returns:
        adjacency_matrix (np.ndarray): A square adjacency matrix where [i][j] = 1 if there is an edge from node i,j.
    """
    num_nodes = len(node_id2idx.keys())

    adjacency_matrix = np.zeros((num_nodes, num_nodes), dtype=int)
    for edge in edges:
        source_idx = node_id2idx[edge.source]
        target_idx = node_id2idx[edge.target]
        adjacency_matrix[source_idx, target_idx] = 1

    return adjacency_matrix


def search_all_connected_components(adjacency_matrix: np.ndarray) -> list[list[int]]:
    """Get connected node index groups from adjacency matrix.

    Args:
        adjacency_matrix (np.ndarray): adjacency matrix of the nodes. [i][j] = 1 means i->j edge exists.
    Returns:
        all_connected_components (list[list[int]]): list of connected node index for each connected component.
    """

    def dfs(node_idx: int, visited: set[int], adjacency_matrix: np.ndarray) -> None:
        visited.add(node_idx)
        for i in range(len(adjacency_matrix)):
            if adjacency_matrix[node_idx, i] == 1 and i not in visited:
                dfs(i, visited, adjacency_matrix)

    all_connected_components = []
    for i in range(len(adjacency_matrix)):
        visited = set()  # type: set[int]
        dfs(i, visited, adjacency_matrix)
        all_connected_components.append(list(visited))

    return all_connected_components


def extract_promoter_controlling_proteins(
    all_connected_components: list[list[int]],
    node_idx2id: dict[int, str],
    node_idx2category: dict[int, Literal['protein', 'promoter', 'terminator']],
) -> dict[str, list[str]]:
    """Extract the proteins that control each promoter based on the connected components.

    Args:
        all_connected_components (list[list[int]]): List of connected node groups identified by index.
        node_idx2id (dict[int, str]): Mapping from node index to node ID.
        node_idx2category (dict[int, Literal): Mapping from node index to node category.

    Returns:
        dict[str, list[str]]:
            A dictionary where the keys are promoter node IDs and the values are lists of protein node IDs.
    """
    promoter_controlling_proteins = defaultdict(list)
    for i, connected_components in enumerate(all_connected_components):
        if node_idx2category[i] == 'promoter':
            promoter_node_id = node_idx2id[i]

            for j in connected_components:
                if node_idx2category[j] == 'protein':
                    protein_node_id = node_idx2id[j]

                    promoter_controlling_proteins[promoter_node_id].append(protein_node_id)

    return dict(promoter_controlling_proteins)


def build_protein_interact_graph(
    promoter_controlling_proteins: dict[str, list[str]],
    parts_name2node_ids: dict[str, list[str]],
    node_id2data: dict[str, ReactFlowChildNodeData],
    protein_node_ids: list[str],
) -> np.ndarray:
    """Build a protein interaction graph based on control relationships and promoter-protein interactions.

    Args:
        promoter_controlling_proteins (dict[str, list[str]]):
            Dictionary mapping promoter node IDs to lists of controlling protein node IDs.
        parts_name2node_ids (dict[str, list[str]]): Mapping from part names to lists of node IDs related to those parts.
        node_id2data (dict[str, ReactFlowChildNodeData]):
            Mapping from node ID to detailed node data, including control information.
        protein_node_ids (list[str]): List of all protein node IDs.

    Returns:
        protein_interaction_graph (np.ndarray):
            A square matrix representing protein interaction, where [i][j] = -1 or 1
            if protein i is repressed or activated by protein j, and 0 otherwise.
    """
    num_protein_nodes = len(protein_node_ids)

    protein_interaction_graph = np.zeros((num_protein_nodes, num_protein_nodes), dtype=int)
    for i, protein_node_id in enumerate(protein_node_ids):
        control_to_list = node_id2data[protein_node_id].controlTo

        for control_to_item in control_to_list:
            control_type_int = CONTROL_TYPE_STR2INT[control_to_item.type]
            promoter_node_ids = parts_name2node_ids.get(control_to_item.name, [])

            for promoter_node_id in promoter_node_ids:
                for controlled_protein_node_id in promoter_controlling_proteins.get(promoter_node_id, []):
                    protein_interaction_graph[protein_node_ids.index(controlled_protein_node_id), i] = control_type_int

    return protein_interaction_graph
