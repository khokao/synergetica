export const activateConnectedEdgesAnimation = (eds, nodeId) => {
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

export const deactivateConnectedEdgesAnimation = (eds, nodeId) => {
  return eds.map((e) => {
    if (e.source === nodeId || e.target === nodeId) {
      return {
        ...e,
        animated: false,
      };
    }
    return e;
  });
};
