import { createActivationEdge, createRepressionEdge } from "@/components/circuit/hooks/utils/create-edge";
import { useNodes, useReactFlow } from "@xyflow/react";
import type { Edge } from "@xyflow/react";
import { produce } from "immer";
import { useCallback, useEffect } from "react";
import { useDebounce } from "use-debounce";

export const useUpdateAnnotationEdges = () => {
  const { getEdges, setEdges } = useReactFlow();
  const nodes = useNodes();
  const [debouncedNodes] = useDebounce(nodes, 500);

  const handleAnnotationEdges = useCallback(() => {
    const edges = getEdges();

    const newEdges = produce(edges, (draft) => {
      const customEdges = draft.filter((e) => e.type === "custom");
      draft.length = 0;
      draft.push(...customEdges);

      const edgeExists = (source, target) =>
        draft.some((e) => e.type === "annotation" && e.source === source && e.target === target);

      for (const n of debouncedNodes) {
        if (n.type !== "child") continue;

        const data = n.data;

        const processControls = (controls, isControlBy) => {
          if (Array.isArray(controls)) {
            for (const control of controls) {
              const relatedNode = debouncedNodes.find((nn) => nn.data.name === control.name);

              if (relatedNode) {
                const sourceId = isControlBy ? relatedNode.id : n.id;
                const targetId = isControlBy ? n.id : relatedNode.id;

                if (!edgeExists(sourceId, targetId)) {
                  let edge: Edge | undefined;
                  if (control.type === "Activation") {
                    edge = createActivationEdge(sourceId, targetId);
                  } else if (control.type === "Repression") {
                    edge = createRepressionEdge(sourceId, targetId);
                  }
                  if (edge) draft.push(edge);
                }
              }
            }
          }
        };

        processControls(data.controlBy, true);
        processControls(data.controlTo, false);
      }
    });

    setEdges(newEdges);
  }, [debouncedNodes, setEdges, getEdges]);

  useEffect(() => {
    handleAnnotationEdges();
  }, [handleAnnotationEdges]);
};
