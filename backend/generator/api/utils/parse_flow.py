from operator import itemgetter

from ..schemas import ReactFlowNode


def get_ordered_parent2children(nodes: list[ReactFlowNode]) -> dict[str, list[str]]:
    parent_position_pairs = sorted(
        [(node.id, node.position.y) for node in nodes if node.type == 'parent'], key=itemgetter(1)
    )

    parent2child_position_pairs = {parent_id: [] for parent_id, _ in parent_position_pairs}  # type: ignore
    for node in nodes:
        if node.type == 'child' and node.parentId is not None:
            parent2child_position_pairs[node.parentId].append((node.id, node.position.x))

    parent2children = {}
    for parent_id, child_position_pairs in parent2child_position_pairs.items():
        child_position_pairs = sorted(child_position_pairs, key=itemgetter(1))
        parent2children[parent_id] = [child_id for child_id, _ in child_position_pairs]

    return parent2children


def get_child_id2key(nodes: list[ReactFlowNode], key: str) -> dict[str, str]:
    child_id2key = {node.id: getattr(node.data, key) for node in nodes if node.type == 'child'}
    return child_id2key
