from ..schemas import OutputChildNodeDetails, ReactFlowNode
from .parse_flow import get_child_id2key, get_ordered_parent2children


def create_parent2child_details(
    all_ga_outputs: dict[str, dict[str, list[str] | list[float]]],
    nodes: list[ReactFlowNode],
) -> dict[str, list[OutputChildNodeDetails]]:
    parent2children = get_ordered_parent2children(nodes=nodes)
    child_id2category = get_child_id2key(nodes=nodes, key='nodeCategory')
    child_id2sequence = get_child_id2key(nodes=nodes, key='sequence')

    parent2child_details = {}  # type: dict[str, list[OutputChildNodeDetails]]
    for parent_id, child_ids in parent2children.items():
        parent2child_details[parent_id] = []
        for child_id in child_ids:
            if child_id in all_ga_outputs.keys():
                details = OutputChildNodeDetails(
                    **{
                        'node_category': 'rbs',
                        'sequence': str(all_ga_outputs[child_id]['sequences'][0]).upper(),
                    }
                )
                parent2child_details[parent_id].append(details)

            details = OutputChildNodeDetails(
                **{
                    'node_category': child_id2category[child_id],
                    'sequence': child_id2sequence[child_id].upper(),
                }
            )
            parent2child_details[parent_id].append(details)

    return parent2child_details
