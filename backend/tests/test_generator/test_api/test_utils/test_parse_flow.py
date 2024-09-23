from generator.api.schemas import ReactFlowObject
from generator.api.utils.parse_flow import get_child_id2key, get_parent2ordered_children


def test_parent2children_is_ordered(get_test_circuit, parent_ids, child_ids):
    parent_ids_order = ['bVl9HNco7sIW-5TMtKGYK', '4zMfqishHf2qroUA5zFrC']
    reactflow_object = ReactFlowObject(**get_test_circuit)

    parent2ordered_children = get_parent2ordered_children(reactflow_object.nodes)

    assert list(parent2ordered_children.keys()) == parent_ids_order
    assert {child_id for children in parent2ordered_children.values() for child_id in children} == set(child_ids)


def test_child_id2key_sequence(get_test_circuit, child_ids):
    reactflow_object = ReactFlowObject(**get_test_circuit)

    child_id2sequence = get_child_id2key(reactflow_object.nodes, 'sequence')

    assert set(child_id2sequence.keys()) == set(child_ids)
    assert all(sequence is not None for sequence in child_id2sequence.values())
