import pytest
from omegaconf import OmegaConf

from simulator.modules.build_protein_interaction import (
    build_protein_interact_graph,
    get_protein_interaction,
    get_protein_nameId_dict,
    run_convert,
    search_interaction_through_promoter,
)
from simulator.modules.parse_gui_graph import (
    create_partsId_nodeId_table,
    parse_all_nodes,
    parse_edge_connection,
)

TEST_PROMOTER_PARTS_ID = '3aa865db07b14c56e1a95166d36b27819cacf657d350d8b85fb3b88e74d04f3c'
TEST_CONTROL_DETAILS = 'Repression'


@pytest.fixture
def setup_node_parser(get_test_circuit):
    circuit = OmegaConf.create(get_test_circuit)
    all_nodes = parse_all_nodes(circuit.nodes)
    promoter_controlling_proteins = parse_edge_connection(circuit.edges, all_nodes)
    yield all_nodes, promoter_controlling_proteins


def test_search_interaction_through_promoter(setup_node_parser):
    # Arrange
    all_nodes, promoter_controlling_proteins = setup_node_parser
    partsId_to_nodeIds = create_partsId_nodeId_table(all_nodes)

    # Act
    protein_interaction = search_interaction_through_promoter(
        promoter_partsId=TEST_PROMOTER_PARTS_ID,
        control_details=TEST_CONTROL_DETAILS,
        promoter_controlling_proteins=promoter_controlling_proteins,
        partsId_to_nodeIds=partsId_to_nodeIds,
    )

    # Assert
    assert len(protein_interaction) == 1
    assert list(protein_interaction.values())[0] in [-1, 1]


def test_get_protein_interaction(setup_node_parser):
    all_nodes, promoter_controlling_proteins = setup_node_parser
    partsId_to_nodeIds = create_partsId_nodeId_table(all_nodes)
    protein_interaction = get_protein_interaction(
        controlTo_info_list=[
            {
                'partsId': TEST_PROMOTER_PARTS_ID,
                'controlType': TEST_CONTROL_DETAILS,
            }
        ],
        promoter_controlling_proteins=promoter_controlling_proteins,
        partsId_to_nodeIds=partsId_to_nodeIds,
    )

    assert len(protein_interaction) == 1
    assert list(protein_interaction.values())[0] in [-1, 1]


def test_build_protein_interact_graph(setup_node_parser):
    # Arrange
    all_nodes, promoter_controlling_proteins = setup_node_parser

    # Act
    protein_interact_graph, proteinId_list = build_protein_interact_graph(all_nodes, promoter_controlling_proteins)

    # Assert
    assert protein_interact_graph.shape == (2, 2)
    assert protein_interact_graph[0][1] == -1
    assert len(proteinId_list) == 2


def test_get_protein_nameId_dict(get_test_circuit):
    # Arrange
    circuit = OmegaConf.create(get_test_circuit)
    protein_interact_graph, proteinId_list, all_nodes = run_convert(circuit)

    # Act
    protein_nameId_dict = get_protein_nameId_dict(proteinId_list, all_nodes)

    # Assert
    assert protein_nameId_dict == {'RPp8K6j_urCFeMtsm2pZv': 'BM3R1', 'QaBV3nMXJxcNaNN_hE6ji': 'AmeR'}
