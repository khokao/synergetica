from typing import Callable

import numpy as np
import numpy.typing as npt
from scipy.integrate import odeint


def solve_ode_with_euler(
    derivative_function: Callable[..., tuple[float, ...]],
    times: list[float] | npt.NDArray[np.float64],
    var_init: list[float] | npt.NDArray[np.float64],
    args: tuple[float, ...] | None,
) -> npt.NDArray[np.float64]:
    """
    Args:
        derivative_function (Callable): Function to solve, which requires the following arguments:
            y0 (array): Initial values for variables.
            t (array): A sequence of time points for which to solve for y.
            args (tuple | None): Extra arguments to pass to function.
        times (list[float] | npt.NDArray[np.float64]): A sequence of time points.
        var_init (list[float]): Initial values for variables.
        args (tuple[float, ...] | None): Extra arguments to pass to function.

    Returns:
        solution (NDArray[np.float64]): Solution of a differential equation.
            shape: (len(times), len(var_init))
    """
    assert len(times), 'Times should not be empty'
    assert len(var_init), 'Initial values should not be empty'

    solution: npt.NDArray[np.float64] = odeint(
        func=derivative_function,
        y0=var_init,
        t=times,
        args=args,
    )
    return solution


def toggle_example(var: list[float], t: float, a1: float, a2: float, n: float, m: float) -> tuple[float, float]:
    """toggle switch model example for development

    Args:
        var (list[float]): list of values of equation
        t (int): time
        a1 (float): parameter of a1
        a2 (float): parameter of a2
        n (float): parameter of n
        m (float): parameter of m

    Returns:
        list[float]: cauculated values of the equation
    """
    dudt = a1 / (1 + var[1] ** n) - var[0]
    dvdt = a2 / (1 + var[0] ** m) - var[1]

    return (dudt, dvdt)


def run_euler_example(alpha1: float = 1.0, alpha2: float = 1) -> npt.NDArray[np.float64]:
    """Run the Euler example for toggle switch model

    Args:
        alpha1 (float, optional): varying param. Defaults to 1.0.
        alpha2 (float, optional): varying param. Defaults to 1.

    Returns:
        npt.NDArray[np.float64]: Solution of a differential equation.
    """
    a1 = alpha1
    a2 = alpha2
    n = 8.0
    m = 8.0
    var_init = [1.0, 1.5]
    times = np.arange(0, 30, 0.1)

    return solve_ode_with_euler(toggle_example, times, var_init, args=(a1, a2, n, m))
