from typing import Any, Callable, List, Tuple

import numpy as np
from scipy.integrate import odeint


def euler(function: Callable, times: Any, var_init: List[float], args: Tuple[float, ...] | None) -> np.ndarray:
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
    solution: Any = odeint(function, var_init, times, args=args)

    return solution  # type: ignore


def toggle_example(var: List[float], t: float, a1: float, a2: float, n: float, m: float) -> List[float]:
    """toggle switch model example for development

    Args:
        var (List[float]): list of values of equation
        t (int): time
        a1 (float): parameter of a1
        a2 (float): parameter of a2
        n (float): parameter of n
        m (float): parameter of m

    Returns:
        List[float]: cauculated values of the equation
    """
    dudt = a1 / (1 + var[1] ** n) - var[0]
    dvdt = a2 / (1 + var[0] ** m) - var[1]

    return [dudt, dvdt]


def run_euler_example(alpha1: float = 1.0, alpha2: float = 1) -> np.ndarray:
    """Run the Euler example for toggle switch model

    Args:
        alpha1 (float, optional): varying param. Defaults to 1.0.
        alpha2 (float, optional): varying param. Defaults to 1.

    Returns:
        np.ndarray: result of calculation
    """
    a1 = alpha1
    a2 = alpha2
    n = 8.0
    m = 8.0
    var_init = [1.0, 1.5]
    times = np.arange(0, 30, 0.1)

    return euler(toggle_example, times, var_init, args=(a1, a2, n, m))
