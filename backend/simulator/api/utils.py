from collections import defaultdict

from .schemas import ReactFlowChildNodeData


def get_protein_id2parts_name(
    protein_node_ids: list[str], node_id2data: dict[str, ReactFlowChildNodeData]
) -> dict[str, str]:
    """Get dict of protein id to display protein name.

    Args:
        protein_node_ids (list[str]): List of protein node ids.
        node_id2data (dict[str, ReactFlowChildNodeData]): Dict of node id to node data.

    Returns:
        protein_id2display_name (dict[str,str]): Dict of protein id and display protein name. {protein_id: protein_name}
            if there are multiple proteins with the same name, add number to the end of the name.
    """
    parts_name_count = defaultdict(int)  # type: dict[str, int]
    protein_id2display_name = {}
    for protein_node_id in protein_node_ids:
        protein_parts_name = node_id2data[protein_node_id].name
        parts_name_count[protein_parts_name] += 1

        count = parts_name_count[protein_parts_name]
        suffix = f'_{count}' if count > 1 else ''
        protein_id2display_name[protein_node_id] = f'{protein_parts_name}{suffix}'

    return protein_id2display_name
