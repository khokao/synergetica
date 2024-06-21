from typing import Any,Callable

import numpy as np
from scipy.integrate import odeint


def euler(function:Callable, times: list[float], var_init: list[float], args: tuple[Any, ...] | None) -> np.ndarray:
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
    solution = odeint(function, var_init, times, args=args) # type: np.ndarray

    return solution
