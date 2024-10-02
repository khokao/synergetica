from generator.api.schemas import ReactFlowObject
from generator.api.utils.parse_flow import get_child_id2key, get_parent2ordered_children


def test_parent2children_is_ordered(test_circuit, parent_ids, child_ids):
    parent_ids_order = ['sad-apples-appear', 'soft-rabbits-boil']
    reactflow_object = ReactFlowObject(**test_circuit)

    parent2ordered_children = get_parent2ordered_children(reactflow_object.nodes)

    assert list(parent2ordered_children.keys()) == parent_ids_order
    assert {child_id for children in parent2ordered_children.values() for child_id in children} == set(child_ids)


def test_child_id2key_sequence(test_circuit, child_ids):
    reactflow_object = ReactFlowObject(**test_circuit)

    child_id2sequence = get_child_id2key(reactflow_object.nodes, 'sequence')

    assert set(child_id2sequence.keys()) == set(child_ids)
    assert all(sequence is not None for sequence in child_id2sequence.values())
