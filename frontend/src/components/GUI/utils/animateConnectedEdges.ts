export const animateConnectedEdges = (eds, nodeId) => {
  return eds.map((e) => {
    if (e.source === nodeId || e.target === nodeId) {
      return {
        ...e,
        animated: true,
      };
    }
    return e;
  });
};
