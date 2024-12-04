from collections.abc import Callable

import numpy as np
import numpy.typing as npt
from scipy.integrate import odeint


def solve_ode_with_euler(
    derivative_function: Callable[..., tuple[float, ...]],
    times: list[float] | npt.NDArray[np.float64],
    var_init: list[float] | npt.NDArray[np.float64],
    args: tuple[float, ...],
) -> npt.NDArray[np.float64]:
    """
    Args:
        derivative_function (Callable): Function to solve, which requires the following arguments:
            y0 (array): Initial values for variables.
            t (array): A sequence of time points for which to solve for y.
            args (tuple): Extra arguments to pass to function.
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
