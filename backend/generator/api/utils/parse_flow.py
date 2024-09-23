from operator import itemgetter

from ..schemas import ReactFlowNode


def get_parent2ordered_children(nodes: list[ReactFlowNode]) -> dict[str, list[str]]:
    """
    Args:
        nodes (list[ReactFlowNode]): List of ReactFlowNode objects.

    Returns:
        dict[str, list[str]]: Dictionary mapping parent node IDs to a list of ordered child node IDs.
    """
    parent_position_pairs = sorted(
        [(node.id, node.position.y) for node in nodes if node.type == 'parent'], key=itemgetter(1)
    )

    parent2child_position_pairs = {parent_id: [] for parent_id, _ in parent_position_pairs}  # type: ignore
    for node in nodes:
        if node.type == 'child' and node.parentId is not None:
            parent2child_position_pairs[node.parentId].append((node.id, node.position.x))

    parent2ordered_children = {}
    for parent_id, child_position_pairs in parent2child_position_pairs.items():
        child_position_pairs = sorted(child_position_pairs, key=itemgetter(1))
        parent2ordered_children[parent_id] = [child_id for child_id, _ in child_position_pairs]

    return parent2ordered_children


def get_child_id2key(nodes: list[ReactFlowNode], key: str) -> dict[str, str]:
    child_id2key = {node.id: getattr(node.data, key) for node in nodes if node.type == 'child'}
    return child_id2key
