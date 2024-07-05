import { groupNodes, ungroupNodes } from "@/components/GUI/utils/groupNodes";
import type { Node } from "reactflow";
import { describe, expect, it } from "vitest";

describe("groupNodes utility function", () => {
  it("should group multiple child nodes into a parent node", () => {
    // Arrange
    const childNodes: Node[] = [
      {
        id: "child-1",
        type: "child",
        position: { x: 100, y: 100 },
        width: 50,
        height: 50,
        data: {},
      },
      {
        id: "child-2",
        type: "child",
        position: { x: 200, y: 200 },
        width: 50,
        height: 50,
        data: {},
      },
    ];

    // Act
    const groupedNodes = groupNodes(childNodes);

    // Assert
    const parentNode = groupedNodes.find((n) => n.type === "parent");
    expect(parentNode).toBeTruthy();
    expect(parentNode.position).toEqual({ x: 80, y: 80 }); // { minX - margin, minY - margin } (100 - 20, 100 - 20)
    expect(parentNode.data.width).toBe(190); // maxX - minX + margin * 2 (200 + 50 - 100 + 20 * 2 = 190)
    expect(parentNode.data.height).toBe(190); // maxY - minY + margin * 2 (200 + 50 - 100 + 20 * 2 = 190)

    const childNode1 = groupedNodes.find((n) => n.id === "child-1");
    const childNode2 = groupedNodes.find((n) => n.id === "child-2");
    expect(childNode1.position).toEqual({ x: 20, y: 20 }); // relative to parent (100 - 80, 100 - 80)
    expect(childNode2.position).toEqual({ x: 120, y: 120 }); // relative to parent (200 - 80, 200 - 80)
    expect(childNode1.parentId).toBe(parentNode.id);
    expect(childNode2.parentId).toBe(parentNode.id);
  });

  it("should return single node without grouping", () => {
    const singleNode: Node = {
      id: "single",
      type: "child",
      position: { x: 100, y: 100 },
      width: 50,
      height: 50,
      data: {},
    };

    const groupedNodes = groupNodes([singleNode]);

    expect(groupedNodes).toHaveLength(1);
    expect(groupedNodes[0]).toEqual(singleNode);
  });

  it("should ungroup nodes correctly", () => {
    const parentNode: Node = {
      id: "parent",
      type: "parent",
      position: { x: 80, y: 80 },
      width: 190,
      height: 190,
      data: { width: 10, height: 170 },
    };
    const childNode1: Node = {
      id: "child-1",
      type: "child",
      position: { x: 20, y: 20 },
      width: 50,
      height: 50,
      data: {},
      parentId: "parent",
    };
    const childNode2: Node = {
      id: "child-2",
      type: "child",
      position: { x: 120, y: 120 },
      width: 50,
      height: 50,
      data: {},
      parentId: "parent",
    };
    const childNode3: Node = {
      id: "child-3",
      type: "child",
      position: { x: 1000, y: 1000 },
      width: 50,
      height: 50,
      data: {},
      parentId: undefined,
    };

    const ungroupedNodes = ungroupNodes([parentNode, childNode1, childNode2, childNode3]);

    expect(ungroupedNodes).toHaveLength(3);
    expect(ungroupedNodes).toEqual([
      {
        ...childNode1,
        parentId: undefined,
        position: { x: 100, y: 100 }, // absolute position
      },
      {
        ...childNode2,
        parentId: undefined,
        position: { x: 200, y: 200 }, // absolute position
      },
      childNode3,
    ]);
  });
});
