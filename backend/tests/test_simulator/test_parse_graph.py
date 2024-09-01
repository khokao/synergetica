import numpy as np
from omegaconf import OmegaConf

from simulator.modules.parse_gui_graph import (
    create_partsId_nodeId_table,
    get_all_connected_nodes,
    parse_all_nodes,
    parse_edge_connection,
)


def test_parse_all_nodes(get_test_circuit):
    circuit = OmegaConf.create(get_test_circuit)
    all_nodes = parse_all_nodes(circuit.nodes)

    assert len(all_nodes) == 6


def test_create_partsId_nodeId_table(get_test_circuit):
    # Arrange
    circuit = OmegaConf.create(get_test_circuit)
    all_nodes, _ = parse_all_nodes(circuit.nodes)

    # Act
    partsId_to_nodeIds = create_partsId_nodeId_table(all_nodes)

    # Assert
    assert len(partsId_to_nodeIds) == 5
    ## terminator partsId
    assert list(partsId_to_nodeIds.keys())[0] == '8e962d8c0de8f20c5dc9047784fc10f3b55053a300cf987bfca6f9c2f3a3d62a'
    assert isinstance(list(partsId_to_nodeIds.values())[0], list)


def test_get_all_connected_nodes():
    adj_matrix = np.array(([0, 1, 1], [1, 0, 0], [1, 0, 0]))
    connected_nodes = get_all_connected_nodes(adj_matrix)

    assert len(connected_nodes) == 3
    assert isinstance(connected_nodes[0], list)
    assert len(connected_nodes[0]) == 3


def test_parse_edge_connection(get_test_circuit):
    circuit = OmegaConf.create(get_test_circuit)
    all_nodes, _ = parse_all_nodes(circuit.nodes)
    promoter_controlling_proteins = parse_edge_connection(circuit.edges, all_nodes)

    assert isinstance(promoter_controlling_proteins, dict)
    assert len(promoter_controlling_proteins) == 2
    assert len(list(promoter_controlling_proteins.values())[0]) == 1
