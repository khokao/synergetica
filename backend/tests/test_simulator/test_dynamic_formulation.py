import numpy as np
import pytest
from omegaconf import OmegaConf

from simulator.modules.build_protein_interaction import run_convert
from simulator.modules.dynamic_formulation import ODEBuilder, build_function_as_str


@pytest.fixture
def example_data(get_test_circuit):
    circuit = OmegaConf.create(get_test_circuit)
    _, proteinId_list, all_nodes = run_convert(circuit)
    yield proteinId_list, all_nodes


def test_mrna_ode_generation(example_data):
    # Arrange
    ode_builder = ODEBuilder()
    proteinId_list, all_nodes = example_data
    idx = 0
    interact_infos = np.array([0, -1])

    # Act
    mrna_ode = ode_builder.make_mrna_ode(idx, interact_infos, proteinId_list, all_nodes)

    # Assert
    expected_ode = 'd0dt = 0.2 * 0.5 * ((0.2 + ((1.0-0.2) * 3.0 ** 2.0) / ( var[3] ** 2.0 + 3.0 ** 2.0)) / 1.0) * 15 - 0.1 * var[0]'  # noqa: E501
    assert mrna_ode == expected_ode, 'mRNA ODE generation failed.'


def test_protein_ode_generation(example_data):
    # Arrange
    ode_builder = ODEBuilder()
    proteinId_list, all_nodes = example_data
    idx = 0

    # Act
    protein_ode = ode_builder.make_protein_ode(idx, proteinId_list, all_nodes)

    # Assert
    expected_ode = 'd1dt = 0.02 * TIR1 * var[0] - 0.1 * var[1]'
    assert protein_ode == expected_ode, 'Protein ODE generation failed.'


def test_build_function_as_str(example_data):
    # Arrange
    proteinId_list, all_nodes = example_data
    protein_interact_graph = np.array([[0, -1], [-1, 0]])

    # Act
    function_str = build_function_as_str(protein_interact_graph, proteinId_list, all_nodes)

    # Assert
    expected_function_str = 'def ODEtoSolve(var:list[float],t:float,TIR1:float,TIR3:float):\n\td0dt = 0.2 * 0.5 * ((0.2 + ((1.0-0.2) * 3.0 ** 2.0) / ( var[3] ** 2.0 + 3.0 ** 2.0)) / 1.0) * 15 - 0.1 * var[0]\n\td1dt = 0.02 * TIR1 * var[0] - 0.1 * var[1]\n\td2dt = 0.1 * 0.5 * ((0.2 + ((1.0-0.2) * 3.0 ** 2.0) / ( var[1] ** 2.0 + 3.0 ** 2.0)) / 1.0) * 15 - 0.1 * var[2]\n\td3dt = 0.02 * TIR3 * var[2] - 0.1 * var[3]\n\treturn (d0dt, d1dt,d2dt, d3dt)'  # noqa: E501
    assert function_str == expected_function_str, 'Function string generation failed.'
