from typing import Any, Callable, List

import numpy as np
from scipy.integrate import odeint


def euler(function: Callable, times: List[float], var_init: List[float], args: tuple[Any, ...] | None) -> np.ndarray:
    """Solve ODEs using Euler's method.

    Args:
        function (callable): callable function to solve
        times (list[float]): list of time steps
        var_init (list[float]): initial values for variables
        args (tuple[Any, ...] | None): optional arguments for the function

    Returns:
        np.ndarray: calculated values with np.ndarray. shape: (len(times), len(var_init))
    """

    # Initialize the solution array
    solution = odeint(function, var_init, times, args=args)  # type: ignore

    return solution


def toggle_example(var: List[float], t, a1, a2, n, m):
    dudt = a1 / (1 + var[1] ** n) - var[0]
    dvdt = a2 / (1 + var[0] ** m) - var[1]

    return [dudt, dvdt]


def run_euler_example(alpha1=1, alpha2=1):
    a1 = alpha1
    a2 = alpha2
    n = 8
    m = 8
    var_init = [1.0, 1.5]
    times = np.arange(0, 30, 0.1)
    solution = euler(toggle_example, times, var_init, args=(a1, a2, n, m))

    return solution
