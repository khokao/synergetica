from collections import defaultdict

from ..api.schemas import ReactFlowChildNode, ReactFlowChildNodeData


def get_parts_id2node_ids(nodes: list[ReactFlowChildNode]) -> dict[str, list[str]]:
    parts_id2node_ids = defaultdict(list)
    for node in nodes:
        parts_id2node_ids[node.data.partsId].append(node.id)
    return dict(parts_id2node_ids)


def get_node_id2data(nodes: list[ReactFlowChildNode]) -> dict[str, ReactFlowChildNodeData]:
    """get node id to data dictionary from the list of ReactFlowChildNode.

    Args:
        nodes (list[ReactFlowChildNode]): List of ReactFlowChildNode.

    Returns:
        node_id2data (dict[str, dict]): Dict of node id to node data.
    """
    node_id2data = {node.id: node.data for node in nodes}
    return node_id2data


def get_specific_category_node_ids(nodes: list[ReactFlowChildNode], node_category: str) -> list[str]:
    """get node ids of specific category from the list of ReactFlowChildNode.

    Args:
        nodes (list[ReactFlowChildNode]): List of ReactFlowChildNode.
        category (str): category to filter.

    Returns:
        node_ids (list[str]): List of node id of the specific category.
    """
    node_ids = [node.id for node in nodes if node.data.nodeCategory == node_category]
    return node_ids
