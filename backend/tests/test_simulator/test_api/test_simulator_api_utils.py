from simulator.api.schemas import ReactFlowObject
from simulator.api.utils import get_protein_id2parts_name
from simulator.modules.utils import get_node_id2data


def test_get_protein_id2parts_name(test_circuit, protein_ids):
    node_id2data = get_node_id2data(ReactFlowObject(**test_circuit).nodes)

    protein_id2parts_name = get_protein_id2parts_name(protein_ids, node_id2data)

    assert set(protein_id2parts_name.keys()) == set(protein_ids)
    assert all(parts_name is not None for parts_name in protein_id2parts_name.values())
