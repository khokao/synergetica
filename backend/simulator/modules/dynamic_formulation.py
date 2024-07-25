# ruff: noqa: F821
import numpy as np


def generate_term(how_interact: int, params: dict[str, float], j: int, first_term_flag: bool) -> str:
    """generate each term based on the interaction information.

    Args:
        how_interact (int): 1 or -1. 1 means activation, -1 means repression.
        params (dict[str,float]): interaction parameters. {param_name: value}
        j (int): index of the given protein.
        first_term_flag (bool): flag to determine whether the term is the first in the equation.

    Raises:
        ValueError: _description_

    Returns:
        str: each term for the interaction.
    """
    term = ''
    if how_interact == 1:
        term += f"({params['a']} * var[{j}]/({params['K']} + var[{j}]**{params['n']})"
    elif how_interact == -1:
        term += f"({params['a']}/({params['K']} + var[{j}]**{params['n']})"
    else:
        raise ValueError(f'Control type {how_interact} not recognized for protein {j}')

    if not first_term_flag:
        term = '*' + ode
    return term


def generate_interact_terms(interact_infos: np.ndarray) -> str:
    interact_term = ''
    first_term_flag = True
    for j, interact_info in enumerate(interact_infos):
        if interact_info is None:
            continue
        else:
            how_interact = interact_info[0]
            params = interact_info[1]
            term = generate_term(how_interact, params, j, first_term_flag)
            interact_term += term
            first_term_flag = False
    return interact_term


def make_ode(interact_infos: np.ndarray, i: int, params) -> str:
    """
    Args:
        interact_info (np.ndarray): interaction info for the target protein. shape=(num_protein,)
            value: (1 or -1, dict{param_name: value})

    Returns:
        ode (str): ode for the target protein entry.
            e.g) dudt = a1 / (1 + var[1] ** n) - var[0]
    """

    if np.all(interact_infos is None):
        # if there is no interaction for the protein,
        # the ode for the protein is "d[x]/dt = α_x - d_x * [x]"
        ode = f'{params['a']} - {params['d']}*var[{i}]'  ## TODO:自分自身に関するパラメタをどうやって取得するか考える。
    else:
        # if there is interaction for the protein,
        # the ode for the protein becomes like "d[x]/dt = f(x1,x2,...,xn) - d_x * [x]".abs
        # the first term "f(x1,x2,...,xn)"" is the interaction term.
        # the second term "- d_x * [x]" is the degradation term.
        ode = ''
        interact_term = generate_interact_terms(interact_infos)
        ode += interact_term

        degradation_term = f"-{params['d']}*var[{i}]"
        ode += degradation_term

    return ode


def build_function_as_str(protein_interact_graph: np.ndarray) -> str:
    """construct ODE function as str to be defined by exec().

    Args:
        protein_graph (np.ndarray): protein_interaction_graph, shape=(n_proteins,n_proteins)
            object: (1 or -1,{param_name: value})

    Returns:
        function_str (str): ODE function as str to be defined.
    """

    function_str = 'def ODEstoSolve(var:list[float],t:float) \n'
    # TODO:可変パラメータはこの段階で変数として定義して受け取れるようにする。
    return_values = 'return ('
    for idx, protein_entry in enumerate(protein_interact_graph):
        ode_str = make_ode(protein_entry, idx)
        function_str += f'd{idx}dt = {ode_str}\n'
        return_values += f'd{idx}dt,'

    return_values = return_values[:-1] + ')'
    function_str += return_values

    return function_str
