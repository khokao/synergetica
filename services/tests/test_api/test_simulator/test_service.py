import pytest

from api.simulator.constants import T0, TF
from api.simulator.schemas import ControlByItemParams, ReactFlowObject
from api.simulator.service import (
    formulate,
    get_chain_promoters,
    get_promoter_controlling_proteins,
    get_protein_name2ids,
    parse_circuit,
    run_simulation,
)


def test_get_promoter_controlling_proteins(test_circuit_hybrid):
    # Arrange
    rfobject = ReactFlowObject(**test_circuit_hybrid)
    child_nodes = [node for node in rfobject.nodes if node.type == 'child']
    annot_edges = [edge for edge in rfobject.edges if edge.type == 'annotation']

    # Act
    result = get_promoter_controlling_proteins(child_nodes, annot_edges)

    # Assert
    assert result == {
        'chain-3-node-1-PameR': [
            (
                'chain-1-node-2-AmeR',
                'Repression',
                ControlByItemParams(**{'Ymax': 3.8, 'Ymin': 0.2, 'K': 0.09, 'n': 1.4}),
            )
        ],
        'chain-3-node-2-PamtR': [
            (
                'chain-2-node-2-AmtR',
                'Repression',
                ControlByItemParams(**{'Ymax': 3.8, 'Ymin': 0.08, 'K': 0.07, 'n': 1.6}),
            )
        ],
    }


def test_get_chain_promoters(test_circuit_hybrid):
    # Arrange
    rfobject = ReactFlowObject(**test_circuit_hybrid)
    child_nodes = [node for node in rfobject.nodes if node.type == 'child']

    # Act
    result = get_chain_promoters(child_nodes)

    # Assert
    assert result == {
        'chain-id-1': ['chain-1-node-1-PphlF'],
        'chain-id-2': ['chain-2-node-1-PpsrA'],
        'chain-id-3': ['chain-3-node-1-PameR', 'chain-3-node-2-PamtR'],
    }


def test_get_protein_name2ids(test_circuit_hybrid):
    # Arrange
    rfobject = ReactFlowObject(**test_circuit_hybrid)
    child_nodes = [node for node in rfobject.nodes if node.type == 'child']

    # Act
    result = get_protein_name2ids(child_nodes)

    # Assert
    assert result == {
        'AmeR': ['chain-1-node-2-AmeR'],
        'AmtR': ['chain-2-node-2-AmtR'],
        'BetI': ['chain-2-node-3-BetI', 'chain-3-node-3-BetI'],
    }


@pytest.mark.parametrize('circuit_fixture', ['test_circuit_flipflop', 'test_circuit_hybrid'])
def test_parse_circuit(circuit_fixture, request):
    # Arrange
    circuit_data = request.getfixturevalue(circuit_fixture)  # Fixtureから回路データを取得
    rfobject = ReactFlowObject(**circuit_data)

    # Act
    parsed_items = parse_circuit(rfobject)

    # Assert
    parsed_item_keys = {
        'nodes_dict',
        'promoter_controlling_proteins',
        'chain_promoters',
        'protein_name2ids',
        'protein_id2argidx',
    }
    assert parsed_items.keys() == parsed_item_keys


@pytest.mark.parametrize('circuit_fixture', ['test_circuit_flipflop', 'test_circuit_hybrid'])
def test_formulate(circuit_fixture, request):
    # Arrange
    circuit_data = request.getfixturevalue(circuit_fixture)
    rfobject = ReactFlowObject(**circuit_data)
    parsed_items = parse_circuit(rfobject)

    # Act
    ode_func = formulate(parsed_items)

    # Assert
    assert callable(ode_func)

    # Check the number of equations
    num_chains = len(parsed_items['chain_promoters'])
    num_proteins = len(parsed_items['protein_name2ids'])
    expected_num_equations = num_chains + num_proteins

    dummy_t = 0.0
    dummy_y = [0.0] * expected_num_equations
    dummy_args = [1.0] * len(parsed_items['protein_id2argidx'])
    result = ode_func(dummy_t, dummy_y, *dummy_args)
    assert len(result) == expected_num_equations


@pytest.mark.parametrize('circuit_fixture', ['test_circuit_flipflop', 'test_circuit_hybrid'])
def test_run_simulation(circuit_fixture, request):
    # Arrange
    circuit_data = request.getfixturevalue(circuit_fixture)
    rfobject = ReactFlowObject(**circuit_data)
    parsed_items = parse_circuit(rfobject)
    ode_func = formulate(parsed_items)

    num_chains = len(parsed_items['chain_promoters'])
    num_proteins = len(parsed_items['protein_name2ids'])
    num_equations = num_chains + num_proteins

    t_span = (T0, TF)
    y0 = [0.0] * num_equations

    params = {}
    for protein_id in parsed_items['protein_id2argidx']:
        params[protein_id] = 1.0

    # --- Act ---
    solutions = run_simulation(parsed_items, ode_func, t_span, y0, params)

    # --- Assert ---
    assert len(solutions) == len(list(range(T0, TF + 1)))
    assert solutions[0].keys() == {'time', *parsed_items['protein_name2ids'].keys()}
