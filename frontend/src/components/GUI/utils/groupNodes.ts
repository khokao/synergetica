import { nanoid } from "nanoid";
import { Edge, type Node } from "reactflow";

export const ungroupNodes = (nds: Node[]): Node[] => {
  return nds
    .map((n) => {
      if (n.type === "parent") {
        return null;
      }
      if (n.type === "child" && n.parentId) {
        const parentNode = nds.find((pn) => pn.id === n.parentId);
        if (parentNode) {
          return {
            ...n,
            parentId: undefined,
            position: {
              x: n.position.x + parentNode.position.x,
              y: n.position.y + parentNode.position.y,
            },
          };
        }
      }
      return { ...n, parentId: undefined };
    })
    .filter(Boolean);
};

export const groupNodes = (nds: Node[]): Node[] => {
  if (nds.length < 2) {
    return nds;
  }

  const minX = Math.min(...nds.map((n) => n.position.x));
  const minY = Math.min(...nds.map((n) => n.position.y));
  const maxX = Math.max(...nds.map((n) => n.position.x + n.width));
  const maxY = Math.max(...nds.map((n) => n.position.y + n.height));

  const parentId = nanoid();
  const mergin = 20;
  const parentX = minX - mergin;
  const parentY = minY - mergin;
  const parentWidth = maxX - minX + mergin * 2;
  const parentHeight = maxY - minY + mergin * 2;
  const parentNode = {
    id: parentId,
    type: "parent",
    position: { x: parentX, y: parentY },
    style: { width: parentWidth, height: parentHeight },
    data: { width: parentWidth, height: parentHeight },
  };

  const childNodes = nds.map((n) => {
    return {
      ...n,
      parentId: parentId,
      position: { x: n.position.x - parentX, y: n.position.y - parentY },
    };
  });

  return [parentNode, ...childNodes];
};
