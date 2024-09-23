from collections import defaultdict
from typing import Literal

import numpy as np

from ..api.schemas import ReactFlowChildNodeData, ReactFlowEdge

CONTROL_TYPE_STR2INT = {
    'Repression': -1,
    'Activation': 1,
}


def create_adjacency_matrix(edges: list[ReactFlowEdge], node_id2idx: dict[str, int]) -> np.ndarray:
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
    parts_id2node_ids: dict[str, list[str]],
    node_id2data: dict[str, ReactFlowChildNodeData],
    protein_node_ids: list[str],
) -> np.ndarray:
    num_protein_nodes = len(protein_node_ids)

    protein_interaction_graph = np.zeros((num_protein_nodes, num_protein_nodes), dtype=int)
    for i, protein_node_id in enumerate(protein_node_ids):
        control_to_list = node_id2data[protein_node_id].controlTo
        if control_to_list is None:
            continue

        for control_to_item in control_to_list:
            control_type_int = CONTROL_TYPE_STR2INT[control_to_item.controlType]
            promoter_node_ids = parts_id2node_ids.get(control_to_item.partsId, [])

            for promoter_node_id in promoter_node_ids:
                for controlled_protein_node_id in promoter_controlling_proteins.get(promoter_node_id, []):
                    protein_interaction_graph[i, protein_node_ids.index(controlled_protein_node_id)] = control_type_int

    return protein_interaction_graph
