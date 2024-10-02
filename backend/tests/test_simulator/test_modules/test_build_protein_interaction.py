import numpy as np

from simulator.api.schemas import ReactFlowObject
from simulator.modules.build_protein_interaction import (
    build_protein_interact_graph,
    create_adjacency_matrix,
    extract_promoter_controlling_proteins,
    search_all_connected_components,
)
from simulator.modules.utils import get_node_id2data, get_parts_id2node_ids


def test_create_adjacency_matrix_creates_correct_matrix(test_circuit, child_ids):
    # Arrange
    reactflow_object = ReactFlowObject(**test_circuit)
    edges = reactflow_object.edges
    node_id2idx = {node.id: idx for idx, node in enumerate(reactflow_object.nodes)}

    # Act
    adjacency_matrix = create_adjacency_matrix(edges, node_id2idx)

    # Assert
    assert adjacency_matrix.shape == (len(child_ids), len(child_ids))
    assert adjacency_matrix.sum() == len(edges)


def test_search_all_connected_components_returns_correct_components():
    # Arrange
    adjacency_matrix = np.array(
        [
            [0, 1, 1, 0, 0],
            [1, 0, 1, 0, 0],
            [1, 1, 0, 0, 0],
            [0, 0, 0, 0, 1],
            [0, 0, 0, 1, 0],
        ]
    )

    # Act
    all_connected_components = search_all_connected_components(adjacency_matrix)

    # Assert
    assert all_connected_components == [[0, 1, 2], [0, 1, 2], [0, 1, 2], [3, 4], [3, 4]]


def test_extract_promoter_controlling_proteins_correctly_extracts_proteins(test_circuit):
    # Arrange
    reactflow_object = ReactFlowObject(**test_circuit)
    node_id2idx = {node.id: idx for idx, node in enumerate(reactflow_object.nodes)}
    adjacency_matrix = create_adjacency_matrix(reactflow_object.edges, node_id2idx)
    connected_components = search_all_connected_components(adjacency_matrix)
    node_idx2id = {idx: node.id for idx, node in enumerate(reactflow_object.nodes)}
    node_idx2category = {idx: node.data.nodeCategory for idx, node in enumerate(reactflow_object.nodes)}

    # Act
    promoter_controlling_proteins = extract_promoter_controlling_proteins(
        connected_components, node_idx2id, node_idx2category
    )

    # Assert
    expected_promoter_controlling_proteins = {
        '03PeAEAA3uRVcCqVHwftQ': ['RPp8K6j_urCFeMtsm2pZv'],
        'bbV7AW66sYRL9UJFXq7uH': ['QaBV3nMXJxcNaNN_hE6ji'],
    }
    assert promoter_controlling_proteins == expected_promoter_controlling_proteins


def test_build_protein_interact_graph_creates_correct_graph(test_circuit, protein_ids):
    # Arrange
    reactflow_object = ReactFlowObject(**test_circuit)
    parts_id2node_ids = get_parts_id2node_ids(reactflow_object.nodes)
    node_id2data = get_node_id2data(reactflow_object.nodes)
    promoter_controlling_proteins = {
        '03PeAEAA3uRVcCqVHwftQ': ['RPp8K6j_urCFeMtsm2pZv'],
        'bbV7AW66sYRL9UJFXq7uH': ['QaBV3nMXJxcNaNN_hE6ji'],
    }

    # Act
    protein_interact_graph = build_protein_interact_graph(
        promoter_controlling_proteins=promoter_controlling_proteins,
        parts_id2node_ids=parts_id2node_ids,
        node_id2data=node_id2data,
        protein_node_ids=protein_ids,
    )

    # Assert
    assert protein_interact_graph.shape == (2, 2)
    assert protein_interact_graph[0][1] == -1
