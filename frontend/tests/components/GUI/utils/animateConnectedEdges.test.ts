import {
  activateConnectedEdgesAnimation,
  deactivateConnectedEdgesAnimation,
} from "@/components/GUI/utils/animateConnectedEdges";
import type { Edge } from "reactflow";
import { describe, expect, it } from "vitest";

describe("activateConnectedEdgesAnimation", () => {
  it("should activate animation for edges connected to the specified node", () => {
    const nodeId = "node-1";
    const edges: Edge[] = [
      { id: "edge-1", source: "node-1", target: "node-2", animated: false },
      { id: "edge-2", source: "node-3", target: "node-4", animated: false },
      { id: "edge-3", source: "node-1", target: "node-3", animated: false },
    ];

    const result = activateConnectedEdgesAnimation(edges, nodeId);

    expect(result).toEqual([
      { id: "edge-1", source: "node-1", target: "node-2", animated: true },
      { id: "edge-2", source: "node-3", target: "node-4", animated: false },
      { id: "edge-3", source: "node-1", target: "node-3", animated: true },
    ]);
  });

  it("should not change edges that are not connected to the specified node", () => {
    const nodeId = "node-5";
    const edges: Edge[] = [
      { id: "edge-1", source: "node-1", target: "node-2", animated: false },
      { id: "edge-2", source: "node-3", target: "node-4", animated: false },
      { id: "edge-3", source: "node-1", target: "node-3", animated: false },
    ];

    const result = activateConnectedEdgesAnimation(edges, nodeId);

    expect(result).toEqual(edges);
  });
});

describe("deactivateConnectedEdgesAnimation", () => {
  it("should deactivate animation for edges connected to the specified node", () => {
    const nodeId = "node-1";
    const edges: Edge[] = [
      { id: "edge-1", source: "node-1", target: "node-2", animated: true },
      { id: "edge-2", source: "node-3", target: "node-4", animated: true },
      { id: "edge-3", source: "node-1", target: "node-3", animated: true },
    ];

    const result = deactivateConnectedEdgesAnimation(edges, nodeId);

    expect(result).toEqual([
      { id: "edge-1", source: "node-1", target: "node-2", animated: false },
      { id: "edge-2", source: "node-3", target: "node-4", animated: true },
      { id: "edge-3", source: "node-1", target: "node-3", animated: false },
    ]);
  });

  it("should not change edges that are not connected to the specified node", () => {
    const nodeId = "node-5";
    const edges: Edge[] = [
      { id: "edge-1", source: "node-1", target: "node-2", animated: true },
      { id: "edge-2", source: "node-3", target: "node-4", animated: true },
      { id: "edge-3", source: "node-1", target: "node-3", animated: true },
    ];

    const result = deactivateConnectedEdgesAnimation(edges, nodeId);

    expect(result).toEqual(edges);
  });
});
