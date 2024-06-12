import numpy as np
from scipy.integrate import odeint


def euler(function, times: list, var_init: list, args: tuple = None) -> np.ndarray:
    """
    Solve a system of ordinary differential equations using the Euler method.

    Parameters
    ----------
    function : callable
        The right-hand side of the differential equation.
    times : list
        The time points at which the solution is computed.
    args : tuple
        The parameters of the differential equation.

    Returns
    -------
    numpy.ndarray
        The solution of the differential equation at each time point.
    """
    # Initialize the solution array
    solution = odeint(function, var_init, times, args=args)

    return solution
