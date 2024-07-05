import type { Edge } from "reactflow";

export const activateConnectedEdgesAnimation = (eds: Edge[], nodeId: string): Edge[] => {
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

export const deactivateConnectedEdgesAnimation = (eds: Edge[], nodeId: string) => {
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
