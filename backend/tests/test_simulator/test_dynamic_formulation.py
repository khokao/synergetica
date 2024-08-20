import numpy as np
import pytest
from omegaconf import OmegaConf

from simulator.modules.build_protein_interaction import run_convert
from simulator.modules.dynamic_formulation import ODEBuilder, build_function_as_str

from .circuit_for_test import TEST_CIRCUIT


@pytest.fixture
def example_data():
    circuit = OmegaConf.create(TEST_CIRCUIT)
    _, proteinId_idx_bidict, all_nodes = run_convert(circuit)
    yield proteinId_idx_bidict, all_nodes


def test_mrna_ode_generation(example_data):
    # Arrange
    ode_builder = ODEBuilder()
    proteinId_idx_bidict, all_nodes = example_data
    idx = 0
    interact_infos = [0, -1]

    # Act
    mrna_ode = ode_builder.make_mrna_ode(idx, interact_infos, proteinId_idx_bidict, all_nodes)

    # Assert
    expected_ode = 'd0dt = 300 * 0.5 * ((1.0 + ((1.0-0.2) * 3.0 ** 2.0) / ( var[3] ** 2.0 + 3.0 ** 2.0)) / 1.0) *  15 - 0.012145749 * var[0]'  # noqa: E501
    assert mrna_ode == expected_ode, 'mRNA ODE generation failed.'


def test_protein_ode_generation(example_data):
    # Arrange
    ode_builder = ODEBuilder()
    proteinId_idx_bidict, all_nodes = example_data
    idx = 0

    # Act
    protein_ode = ode_builder.make_protein_ode(idx, proteinId_idx_bidict, all_nodes)

    # Assert
    expected_ode = 'd1dt = 1e-05 * TIR1 * var[0] - 0.1 * var[1]'
    assert protein_ode == expected_ode, 'Protein ODE generation failed.'


def test_build_function_as_str(example_data):
    # Arrange
    proteinId_idx_bidict, all_nodes = example_data
    protein_interact_graph = np.array([[0, -1], [-1, 0]])
    # Act
    function_str = build_function_as_str(protein_interact_graph, proteinId_idx_bidict, all_nodes)

    # Assert
    expected_function_str = 'def ODEtoSolve(var:list[float],t:float,TIR1:float,TIR3:float):\n\td0dt = 300 * 0.5 * ((1.0 + ((1.0-0.2) * 3.0 ** 2.0) / ( var[3] ** 2.0 + 3.0 ** 2.0)) / 1.0) *  15 - 0.012145749 * var[0]\n\td1dt = 1e-05 * TIR1 * var[0] - 0.1 * var[1]\n\td2dt = 300 * 0.5 * ((1.0 + ((1.0-0.2) * 3.0 ** 2.0) / ( var[1] ** 2.0 + 3.0 ** 2.0)) / 1.0) *  15 - 0.012145749 * var[2]\n\td3dt = 1e-05 * TIR3 * var[2] - 0.1 * var[3]\n\treturn (d0dt, d1dt,d2dt, d3dt)'  # noqa: E501
    assert function_str == expected_function_str, 'Function string generation failed.'
