import itertools
from collections import defaultdict
from collections.abc import Callable
from typing import LiteralString

from scipy.integrate import solve_ivp

from .constants import DMRNA, ERPU, PCN, PCN_REF, ZETA
from .schemas import ControlByItemParams, ReactFlowAnnotationEdge, ReactFlowChildNode, ReactFlowObject
from .utils import create_func_str, get_func_from_str


def get_promoter_controlling_proteins(
    child_nodes: list[ReactFlowChildNode],
    annot_edges: list[ReactFlowAnnotationEdge],
) -> dict[str, list[tuple[str, LiteralString, ControlByItemParams]]]:
    """Identifies which proteins regulate each promoter and collects the control parameters.

    Args:
        child_nodes (list[ReactFlowChildNode]): A list of child nodes.
        annot_edges (list[ReactFlowAnnotationEdge]): A list of annotation edges describing interactions.

    Returns:
        dict[str, list[tuple[str, LiteralString, ControlByItemParams]]]:
            A dictionary where each key is a promoter node ID, and the value is a list of tuples. Each tuple contains:
            - The protein node ID (str),
            - The control type (LiteralString, e.g. "Repression" or "Activation"),
            - The control parameters (ControlByItemParams).
    """
    promoter_controlling_proteins = defaultdict(list)
    for edge in annot_edges:
        for node in child_nodes:
            if node.id == edge.source:
                source_node = node
                break

        for node in child_nodes:
            if node.id == edge.target:
                target_node = node
                for control_item in target_node.data.controlBy:
                    if control_item.name == source_node.data.name:
                        control_type = control_item.type
                        control_params = control_item.params
                        break
        promoter_controlling_proteins[target_node.id].append((source_node.id, control_type, control_params))
    return dict(promoter_controlling_proteins)


def get_chain_promoters(
    child_nodes: list[ReactFlowChildNode],
) -> dict[str, list[str]]:
    """Groups promoter IDs by their parent chain ID.

    Args:
        child_nodes (list[ReactFlowChildNode]): A list of child nodes.

    Returns:
        dict[str, list[str]]:
            A dictionary where each key is a chain ID (the parent node ID),
            and the value is a list of promoter node IDs belonging to that chain.
    """
    chain_promoters = defaultdict(list)
    for node in child_nodes:
        if node.data.category == 'Promoter':
            chain_promoters[node.parentId].append(node.id)
    return dict(chain_promoters)


def get_protein_name2ids(
    child_nodes: list[ReactFlowChildNode],
) -> dict[str, list[str]]:
    """Maps each protein name to the list of node IDs.

    Args:
        child_nodes (list[ReactFlowChildNode]): A list of child nodes.

    Returns:
        dict[str, list[str]]:
            A dictionary where each key is a protein name, and the value is a list
            of node IDs corresponding to that protein.
    """
    protein_name2ids = defaultdict(list)
    for node in child_nodes:
        if node.data.category == 'Protein':
            protein_name2ids[node.data.name].append(node.id)
    return dict(sorted(protein_name2ids.items()))


def parse_circuit(reactflow_object: ReactFlowObject) -> dict:
    """Parses the ReactFlowObject to extract simulation-relevant information.

    Args:
        reactflow_object (ReactFlowObject): ReactFlow object representing the circuit.

    Returns:
        dict:
            A dictionary containing key-value pairs that represent parsed
            information about the circuit. Notable keys include:

            - "nodes_dict": A dictionary of node_id -> ReactFlowChildNode
            - "promoter_controlling_proteins":
                A dict of promoter ID -> list of (protein ID, control type, control params)
            - "chain_promoters":
                A dict of chain ID -> list of promoter IDs
            - "protein_name2ids":
                A dict of protein name -> list of protein IDs
            - "protein_id2argidx":
                A dict of protein ID -> index in the simulation function arguments
    """
    child_nodes = [node for node in reactflow_object.nodes if node.type == 'child']
    annot_edges = [edge for edge in reactflow_object.edges if edge.type == 'annotation']

    nodes_dict = {node.id: node for node in child_nodes}

    promoter_controlling_proteins = get_promoter_controlling_proteins(child_nodes, annot_edges)
    chain_promoters = get_chain_promoters(child_nodes)
    protein_name2ids = get_protein_name2ids(child_nodes)

    protein_id2argidx = {
        protein_id: argidx for argidx, protein_id in enumerate(itertools.chain.from_iterable(protein_name2ids.values()))
    }

    parsed_items = {
        'nodes_dict': nodes_dict,
        'promoter_controlling_proteins': promoter_controlling_proteins,
        'chain_promoters': chain_promoters,
        'protein_name2ids': protein_name2ids,
        'protein_id2argidx': protein_id2argidx,
    }

    return parsed_items


def formulate(parsed_items: dict[str, dict]) -> Callable:
    """Constructs ODE for mRNA and protein concentrations.

    NOTE: Number of equations = number of chains + number of unique proteins.

    Args:
        parsed_items (dict[str, dict]): A dictionary obtained from `parse_circuit`,

    Returns:
        Callable:
            A Python function representing the system of ODEs in the form
            `func(y, t, *arg)`, which can be passed to numerical solvers
            like `scipy.integrate.odeint`.
    """
    nodes_dict = parsed_items['nodes_dict']
    promoter_controlling_proteins = parsed_items['promoter_controlling_proteins']
    chain_promoters = parsed_items['chain_promoters']
    protein_name2ids = parsed_items['protein_name2ids']
    protein_id2argidx = parsed_items['protein_id2argidx']

    chain_id2eqidx = {chain_id: idx for idx, chain_id in enumerate(chain_promoters.keys())}
    protein_name2eqidx = {name: len(chain_promoters.keys()) + idx for idx, name in enumerate(protein_name2ids.keys())}

    chain_odes = []
    for chain_id, promoter_ids in chain_promoters.items():
        components = []
        for promoter_id in promoter_ids:
            if promoter_id not in promoter_controlling_proteins:
                Ydef = nodes_dict[promoter_id].data.params.Ydef
                components.append(f'{Ydef}')
            else:
                for protein_id, control_type, control_item in promoter_controlling_proteins[promoter_id]:
                    protein_name = nodes_dict[protein_id].data.name
                    protein_eqidx = protein_name2eqidx[protein_name]

                    Ymin = control_item.Ymin
                    Ymax = control_item.Ymax
                    K = control_item.K
                    n = control_item.n

                    if control_type == 'Repression':
                        components.append(
                            f'({Ymin} + ({Ymax} - {Ymin}) * ({K}**{n} / ({K}**{n} + y[{protein_eqidx}]**{n})))'
                        )
                    elif control_type == 'Activation':
                        components.append(
                            f'({Ymin} + ({Ymax} - {Ymin}) * (y[{protein_eqidx}]**{n} / ({K}**{n} + y[{protein_eqidx}]**{n})))'  # noqa: E501
                        )
        joined_components = ' + '.join(components)

        chain_eqidx = chain_id2eqidx[chain_id]
        chain_ode = (
            f'd{chain_eqidx}dt = ({PCN} / {PCN_REF}) * {ZETA} * ({joined_components}) - {DMRNA} * y[{chain_eqidx}]'
        )
        chain_odes.append(chain_ode)

    protein_odes = []
    for protein_name, protein_ids in protein_name2ids.items():
        components = []
        for protein_id in protein_ids:
            chain_id = nodes_dict[protein_id].parentId
            chain_eqidx = chain_id2eqidx[chain_id]

            protein_argidx = protein_id2argidx[protein_id]
            TIRb = nodes_dict[protein_id].data.params.TIRb

            components.append(f'(arg[{protein_argidx}] / {TIRb}) * y[{chain_eqidx}]')
        joined_components = ' + '.join(components)

        protein_eqidx = protein_name2eqidx[protein_name]
        Dp = nodes_dict[protein_id].data.params.Dp
        protein_ode = f'd{protein_eqidx}dt = {ERPU} * ({joined_components}) - {Dp} * y[{protein_eqidx}]'
        protein_odes.append(protein_ode)

    odes = chain_odes + protein_odes

    func_str = create_func_str(odes)
    func = get_func_from_str(func_str)

    return func


def run_simulation(
    parsed_items: dict,
    func: Callable,
    t_span: tuple[int, int],
    y0: list[float],
    params: dict[str, float],
) -> list[dict]:
    """Executes the ODE simulation using given parameters.

    Args:
        parsed_items (dict): The dictionary produced by `parse_circuit`
        func (Callable): The derivative function created by `formulate`.
        t_span (tuple[int, int]): The start and end time points for the simulation.
        y0 (list[float]): The initial values for the ODE variables (mRNA and protein concentrations).
        params (dict[str, float]): TIR values for each protein ID.

    Returns:
        list[dict]:
            A list of solution dictionaries, where each dictionary has:

            - "time": The current time point,
            - "<protein_name>": The computed protein concentration at that time.

            Example:
            [
                {"time": 0,   "ProteinA": 0.0, "ProteinB": 0.0, ...},
                {"time": 1,   "ProteinA": 0.1, "ProteinB": 0.05, ...},
                ...
            ]
    """
    func_args = [0.0] * len(params.keys())
    for protein_id, argidx in parsed_items['protein_id2argidx'].items():
        func_args[argidx] = params[protein_id]

    y = solve_ivp(func, t_span, y0, method='RK45', args=tuple(func_args), first_step=1, max_step=1).y

    num_chains = len(parsed_items['chain_promoters'])
    protein_names = list(parsed_items['protein_name2ids'].keys())

    solutions = []
    for i, ti in enumerate(list(range(t_span[0], t_span[1] + 1))):
        sol = {'time': ti}
        for j, protein_name in enumerate(protein_names):
            sol[protein_name] = y[num_chains + j, i]
        solutions.append(sol)

    return solutions
