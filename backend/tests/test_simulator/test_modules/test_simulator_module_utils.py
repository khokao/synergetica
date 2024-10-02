from simulator.api.schemas import ReactFlowObject
from simulator.modules.utils import get_node_id2data, get_parts_id2node_ids, get_specific_category_node_ids


def test_parts_id2node_ids(test_circuit, child_ids):
    nodes = ReactFlowObject(**test_circuit).nodes

    parts_id2node_ids = get_parts_id2node_ids(nodes)

    assert {node_id for node_ids in parts_id2node_ids.values() for node_id in node_ids} == set(child_ids)


def test_node_id2data(test_circuit, child_ids):
    nodes = ReactFlowObject(**test_circuit).nodes

    node_id2data = get_node_id2data(nodes)

    assert set(node_id2data.keys()) == set(child_ids)


def test_specific_category_node_ids(test_circuit, protein_ids):
    nodes = ReactFlowObject(**test_circuit).nodes

    protein_node_ids = get_specific_category_node_ids(nodes, node_category='protein')

    assert set(protein_node_ids) == set(protein_ids)
