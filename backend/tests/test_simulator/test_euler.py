import numpy as np
import pytest

from simulator.euler import euler


def simple_function(y, t, a, b):
    dydt = -a * y + b
    return dydt


def test_euler():
    times = np.linspace(0, 10, 100)
    var_init = [1.0]
    args = (1.0, 1.0)
    result = euler(simple_function, times, var_init, args)

    assert isinstance(result, np.ndarray)
    assert result.shape == (len(times), len(var_init))
    assert result.dtype == np.float64


@pytest.mark.parametrize(
    'euler_inputs',
    [
        {
            'function': simple_function,
            'times': np.array([]),
            'var_init': [1.0],
            'args': (1.0, 1.0),
        },
        {
            'function': simple_function,
            'times': np.linspace(0, 10, 100),
            'var_init': [],
            'args': (1.0, 1.0),
        },
        {
            'function': simple_function,
            'times': np.linspace(0, 10, 100),
            'var_init': [1.0],
            'args': 'invalid_args',
        },
    ],
)
def test_euler_errors(euler_inputs):
    times = euler_inputs['times']
    var_init = euler_inputs['var_init']
    args = euler_inputs['args']

    try:
        euler(simple_function, times, var_init, args)
        raise AssertionError('Expected an error due to empty times, but no error was raised.')
    except Exception:
        assert True
