import { GROUP_NODE_MARGIN, NODE_HEIGHT, NODE_WIDTH } from "@/components/circuit/constants";
import { groupNodes, ungroupNodes } from "@/components/circuit/hooks/utils/ungroup-group";
import { describe, expect, it } from "vitest";

describe("groupNodes", () => {
  it("should group multiple nodes under a new parent node", () => {
    // Arrange
    const draft = [
      { id: "1", position: { x: 10, y: 20 }, data: {}, parentId: undefined },
      { id: "2", position: { x: 30, y: 40 }, data: {}, parentId: undefined },
    ];
    const nodesToGroup = [...draft];

    const expectedParentX = 10 - GROUP_NODE_MARGIN;
    const expectedParentY = 20 - GROUP_NODE_MARGIN;
    const expectedParentWidth = 30 + NODE_WIDTH - 10 + GROUP_NODE_MARGIN * 2;
    const expectedParentHeight = 40 + NODE_HEIGHT - 20 + GROUP_NODE_MARGIN * 2;

    // Act
    groupNodes(draft, nodesToGroup);

    // Assert
    // parent
    expect(draft[0].position).toEqual({ x: expectedParentX, y: expectedParentY });
    expect(draft[0]).toHaveProperty("width", expectedParentWidth);
    expect(draft[0]).toHaveProperty("height", expectedParentHeight);
    // children
    expect(draft[1].position).toEqual({
      x: 10 - expectedParentX,
      y: 20 - expectedParentY,
    });
    expect(draft[2].position).toEqual({
      x: 30 - expectedParentX,
      y: 40 - expectedParentY,
    });
  });

  it("should not group nodes if less than two nodes are provided", () => {
    // Arrange
    const draft = [{ id: "1", position: { x: 10, y: 20 }, data: {}, parentId: undefined }];
    const nodesToGroup = [...draft];

    // Act
    groupNodes(draft, nodesToGroup);

    // Assert
    expect(draft.length).toBe(1);
    expect(draft[0].id).toBe("1");
  });
});

describe("ungroupNodes", () => {
  it("should ungroup nodes and remove the parent node", () => {
    // Arrange
    const parentNode = {
      id: "parent",
      position: { x: 5, y: 15 },
      data: {},
      parentId: undefined,
      width: 30,
      height: 30,
    };
    const draft = [
      parentNode,
      { id: "1", position: { x: 5, y: 5 }, data: {}, parentId: "parent" },
      { id: "2", position: { x: 25, y: 25 }, data: {}, parentId: "parent" },
    ];

    // Act
    ungroupNodes(draft, parentNode);

    // Assert
    expect(draft.length).toBe(2);
    expect(draft.find((n) => n.id === "parent")).toBeUndefined();
    const node1 = draft.find((n) => n.id === "1");
    const node2 = draft.find((n) => n.id === "2");
    expect(node1?.parentId).toBeUndefined();
    expect(node1?.position).toEqual({ x: 10, y: 20 });
    expect(node2?.parentId).toBeUndefined();
    expect(node2?.position).toEqual({ x: 30, y: 40 });
  });

  it("should do nothing if parentNode is undefined", () => {
    // Arrange
    const draft = [{ id: "1", position: { x: 10, y: 20 }, data: {}, parentId: undefined }];

    // Act
    ungroupNodes(draft, undefined);

    // Assert
    expect(draft).toEqual([{ id: "1", position: { x: 10, y: 20 }, data: {}, parentId: undefined }]);
  });

  it("should do nothing if parent node is not found in draft", () => {
    // Arrange
    const parentNode = {
      id: "parent",
      position: { x: 5, y: 15 },
      data: {},
      parentId: undefined,
      width: 30,
      height: 30,
    };
    const draft = [{ id: "1", position: { x: 10, y: 20 }, data: {}, parentId: undefined }];

    // Act
    ungroupNodes(draft, parentNode);

    // Assert
    expect(draft).toEqual([{ id: "1", position: { x: 10, y: 20 }, data: {}, parentId: undefined }]);
  });
});
