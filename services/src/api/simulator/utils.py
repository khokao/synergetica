from collections.abc import Callable


def create_func_str(odes: list[str]) -> str:
    """Generate a string representation of a Python function for ode solver.

    Args:
        odes (list[str]): A list of strings, where each string represents an ODE.

    Returns:
        str: A string containing a Python function definition.
    """
    indent = '    '
    num_equations = len(odes)
    return_tuple = ', '.join([f'd{i}dt' for i in range(num_equations)])

    indented_lines = [f'{indent}d{i}dt = {odes[i]}' for i in range(num_equations)]
    indented_lines += [f'{indent}return ({return_tuple})']

    return f'def func(t, y, *arg):\n{"\n".join(indented_lines)}'


def get_func_from_str(func_str: str) -> Callable:
    """Create and return a Python function object from a given string definition.

    Args:
        func_str (str): A string containing a Python function definition.

    Returns:
        Callable: The 'func' object defined in the string.
    """
    exec_locals = {}  # type: dict[str, Callable]
    exec(func_str, globals(), exec_locals)
    return exec_locals['func']
