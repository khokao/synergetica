import pytest
from omegaconf import OmegaConf

from simulator.modules.build_protein_interaction import (
    build_protein_interact_graph,
    get_parts_name_list,
    get_protein_interaction,
    run_convert,
    search_interaction_through_promoter,
)
from simulator.modules.parse_gui_graph import (
    create_partsId_nodeId_table,
    parse_all_nodes,
    parse_edge_connection,
)

from .circuit_for_test import TEST_CIRCUIT


@pytest.fixture
def setup_node_parser():
    circuit = OmegaConf.create(TEST_CIRCUIT)
    all_nodes, node_category2ids = parse_all_nodes(circuit.nodes)
    promoter_controlling_proteins = parse_edge_connection(circuit.edges, all_nodes)
    yield all_nodes, node_category2ids, promoter_controlling_proteins


def test_search_interaction_through_promoter(setup_node_parser):
    all_nodes, node_category2ids, promoter_controlling_proteins = setup_node_parser
    partsId_to_nodeIds = create_partsId_nodeId_table(all_nodes)
    protein_interaction = search_interaction_through_promoter(
        promoter_partsId='3aa865db07b14c56e1a95166d36b27819cacf657d350d8b85fb3b88e74d04f3c',
        control_details='Repression',
        promoter_controlling_proteins=promoter_controlling_proteins,
        partsId_to_nodeIds=partsId_to_nodeIds,
    )

    assert len(protein_interaction) == 1
    assert isinstance(list(protein_interaction.values())[0], int)
    assert list(protein_interaction.values())[0] in [-1, 1]


def test_get_protein_interaction(setup_node_parser):
    all_nodes, node_category2ids, promoter_controlling_proteins = setup_node_parser
    partsId_to_nodeIds = create_partsId_nodeId_table(all_nodes)
    protein_interaction = get_protein_interaction(
        controlTo_info_list=[{'8e962d8c0de8f20c5dc9047784fc10f3b55053a300cf987bfca6f9c2f3a3d62a': 'Repression'}],
        promoter_controlling_proteins=promoter_controlling_proteins,
        partsId_to_nodeIds=partsId_to_nodeIds,
    )

    assert len(protein_interaction) == 1
    assert list(protein_interaction.values())[0] in [-1, 1]


def test_build_protein_interact_graph(setup_node_parser):
    all_nodes, node_category2ids, promoter_controlling_proteins = setup_node_parser
    protein_interact_graph, proteinId_idx_bidict = build_protein_interact_graph(
        all_nodes, node_category2ids, promoter_controlling_proteins
    )

    assert protein_interact_graph.shape == (2, 2)
    assert protein_interact_graph[0][1] == -1
    assert isinstance(list(proteinId_idx_bidict.keys())[0], str)
    assert isinstance(list(proteinId_idx_bidict.values())[0], int)
    assert len(proteinId_idx_bidict) == 2


def test_get_parts_name_list():
    circuit = OmegaConf.create(TEST_CIRCUIT)
    protein_interact_graph, proteinId_idx_bidict, all_nodes = run_convert(circuit)
    parts_name_list = get_parts_name_list(proteinId_idx_bidict, all_nodes)

    assert len(parts_name_list) == 2
    for part_name in parts_name_list:
        assert isinstance(part_name, str)
        assert part_name in ['AmeR', 'BM3R1']
