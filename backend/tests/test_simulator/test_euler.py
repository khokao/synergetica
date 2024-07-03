import numpy as np
import pytest
from scipy.integrate import ODEintWarning

from simulator.euler import euler


@pytest.fixture()
def simple_function():
    return lambda y, t, a, b: -a * y + b


def test_euler(simple_function):
    times = np.linspace(0, 10, 100)
    var_init = [1.0]
    args = (1.0, 1.0)

    result = euler(simple_function, times, var_init, args)

    assert isinstance(result, np.ndarray)
    assert result.shape == (len(times), len(var_init))
    assert result.dtype == np.float64


def test_time_empty(simple_function):
    times = np.array([])
    var_init = [1.0]
    args = (1.0, 1.0)
    with pytest.raises(AssertionError):
        euler(simple_function, times, var_init, args)


def test_var_init_empty(simple_function):
    times = np.linspace(0, 10, 100)
    var_init = []
    args = (1.0, 1.0)
    with pytest.warns(ODEintWarning):
        euler(simple_function, times, var_init, args)


def test_args_invalid(simple_function):
    times = np.linspace(0, 10, 100)
    var_init = [1.0]
    args = 'invalid_args'
    with pytest.raises(Exception):
        euler(simple_function, times, var_init, args)
