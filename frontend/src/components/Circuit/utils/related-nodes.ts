

export const findRelatedNodes = (nodes, edge) => {
  const sourceNode = nodes.find((n) => n.id === edge.source);
  const targetNode = nodes.find((n) => n.id === edge.target);

  const parentNode = nodes.find((n) => n.id === sourceNode.parentId || n.id === targetNode.parentId);
  const siblingNodes = parentNode ? nodes.filter((n) => n.parentId === parentNode.id) : [];

  return { sourceNode, targetNode, parentNode, siblingNodes };
};
