import numpy as np

from api.schemas.simulator import ReactFlowObject
from simulator.dynamic_formulation import ODEBuilder, build_function_as_str
from simulator.utils import get_node_id2data


def test_mrna_ode_generation(test_circuit, protein_ids):
    # Arrange
    node_id2data = get_node_id2data(ReactFlowObject(**test_circuit).nodes)
    ode_builder = ODEBuilder()
    idx = 0
    interact_infos = np.array([0, -1])

    # Act
    mrna_ode = ode_builder.make_mrna_ode(idx, interact_infos, protein_ids, node_id2data)

    # Assert
    expected_ode = 'd0dt = 0.2 * 5.590683685e-05 * ((0.2 + ((3.8-0.2) * 0.09 ** 1.4) / ( var[3] ** 1.4 + 0.09 ** 1.4)) / 3.8) * 15 - 0.1 * var[0]'  # noqa: E501
    assert mrna_ode == expected_ode, 'mRNA ODE generation failed.'


def test_protein_ode_generation(test_circuit, protein_ids):
    # Arrange
    node_id2data = get_node_id2data(ReactFlowObject(**test_circuit).nodes)
    ode_builder = ODEBuilder()
    idx = 0

    # Act
    protein_ode = ode_builder.make_protein_ode(idx, protein_ids, node_id2data)

    # Assert
    expected_ode = 'd1dt = 0.02 * TIR1 * var[0] - 0.14726881 * var[1]'
    assert protein_ode == expected_ode, 'Protein ODE generation failed.'


def test_build_function_as_str(test_circuit, protein_ids):
    # Arrange
    node_id2data = get_node_id2data(ReactFlowObject(**test_circuit).nodes)
    protein_interact_graph = np.array([[0, -1], [-1, 0]])

    # Act
    function_str = build_function_as_str(protein_interact_graph, protein_ids, node_id2data)

    # Assert
    expected_function_str = 'def ODEtoSolve(var:list[float],t:float,TIR1:float,TIR3:float):\n\td0dt = 0.2 * 5.590683685e-05 * ((0.2 + ((3.8-0.2) * 0.09 ** 1.4) / ( var[3] ** 1.4 + 0.09 ** 1.4)) / 3.8) * 15 - 0.1 * var[0]\n\td1dt = 0.02 * TIR1 * var[0] - 0.14726881 * var[1]\n\td2dt = 0.2 * 8.389048759e-05 * ((0.004 + ((0.5-0.004) * 0.04 ** 3.4) / ( var[1] ** 3.4 + 0.04 ** 3.4)) / 0.5) * 15 - 0.1 * var[2]\n\td3dt = 0.02 * TIR3 * var[2] - 0.74589307 * var[3]\n\treturn (d0dt, d1dt,d2dt, d3dt)'  # noqa: E501
    assert function_str == expected_function_str, 'Function string generation failed.'
