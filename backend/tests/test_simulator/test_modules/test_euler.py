import numpy as np
import pytest

from simulator.modules.euler import solve_ode_with_euler


@pytest.fixture()
def derivative_function():
    return lambda y, t, a, b: -a * y + b


def test_euler_success_with_valid_arguments(derivative_function):
    times = np.linspace(0, 10, 100)
    var_init = [1.0]
    args = (1.0, 1.0)

    result = solve_ode_with_euler(derivative_function, times, var_init, args)

    assert isinstance(result, np.ndarray)
    assert result.shape == (len(times), len(var_init))
    assert result.dtype == np.float64


def test_euler_fail_with_empty_var_init(derivative_function):
    times = np.linspace(0, 10, 100)
    var_init: list[float] = []
    args = (1.0, 1.0)

    with pytest.raises(AssertionError):
        solve_ode_with_euler(derivative_function, times, var_init, args)


def test_euler_fail_with_empty_times(derivative_function):
    times: list[float] = []
    var_init = [1.0]
    args = (1.0, 1.0)

    with pytest.raises(AssertionError):
        solve_ode_with_euler(derivative_function, times, var_init, args)


@pytest.mark.parametrize(
    'invalid_args',
    [
        (),  # missing 2 required positional arguments: 'a' and 'b'
        (1.0,),  # missing 1 required positional argument: 'b'
        ('invalid_args', 1.0),  # bad operand type for unary -: 'str'
        (1.0, 1.0, 1.0),  # takes 4 positional arguments but 5 were given
    ],
)
def test_euler_fail_with_invalid_args(derivative_function, invalid_args):
    times = np.linspace(0, 10, 100)
    var_init = [1.0]

    with pytest.raises(TypeError):
        solve_ode_with_euler(derivative_function, times, var_init, invalid_args)
