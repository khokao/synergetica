import { isNodeOutsideParent } from "@/components/GUI/utils/isNodeOutsideParent";
import type { Node } from "reactflow";
import { describe, expect, it } from "vitest";

describe("isNodeOutsideParent", () => {
  it("should return false if the child node is completely inside the parent node", () => {
    const parentNode: Node = {
      id: "1",
      position: { x: 50, y: 50 },
      style: { width: 100, height: 100 },
      data: {},
    };
    const childNode: Node = {
      id: "2",
      position: { x: 10, y: 10 },
      width: 50,
      height: 50,
      data: {},
    };

    const result = isNodeOutsideParent(childNode, parentNode);

    expect(result).toBe(false);
  });

  it("should return true if the child node is completely outside the parent node", () => {
    const parentNode: Node = {
      id: "1",
      position: { x: 50, y: 50 },
      style: { width: 100, height: 100 },
      data: {},
    };
    const childNode: Node = {
      id: "2",
      position: { x: 110, y: 110 },
      width: 50,
      height: 50,
      data: {},
    };

    const result = isNodeOutsideParent(childNode, parentNode);

    expect(result).toBe(true);
  });

  it("should return false if the child node is partially outside the parent node on the right", () => {
    const parentNode: Node = {
      id: "1",
      position: { x: 50, y: 50 },
      style: { width: 100, height: 100 },
      data: {},
    };
    const childNode: Node = {
      id: "2",
      position: { x: 80, y: 10 },
      width: 80,
      height: 50,
      data: {},
    };

    const result = isNodeOutsideParent(childNode, parentNode);

    expect(result).toBe(false);
  });

  it("should return false if the child node is partially outside the parent node on the bottom", () => {
    const parentNode: Node = {
      id: "1",
      position: { x: 50, y: 50 },
      style: { width: 100, height: 100 },
      data: {},
    };
    const childNode: Node = {
      id: "2",
      position: { x: 10, y: 80 },
      width: 50,
      height: 80,
      data: {},
    };

    const result = isNodeOutsideParent(childNode, parentNode);

    expect(result).toBe(false);
  });

  it("should return false if the child node is partially outside the parent node on the top", () => {
    const parentNode: Node = {
      id: "1",
      position: { x: 50, y: 50 },
      style: { width: 100, height: 100 },
      data: {},
    };
    const childNode: Node = {
      id: "2",
      position: { x: 10, y: -10 },
      width: 50,
      height: 30,
      data: {},
    };

    const result = isNodeOutsideParent(childNode, parentNode);

    expect(result).toBe(false);
  });

  it("should return false if the child node is partially outside the parent node on the left", () => {
    const parentNode: Node = {
      id: "1",
      position: { x: 50, y: 50 },
      style: { width: 100, height: 100 },
      data: {},
    };
    const childNode: Node = {
      id: "2",
      position: { x: -10, y: 10 },
      width: 30,
      height: 50,
      data: {},
    };

    const result = isNodeOutsideParent(childNode, parentNode);

    expect(result).toBe(false);
  });
});
