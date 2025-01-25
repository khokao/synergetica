import { DnDProvider } from "@/components/circuit/dnd/dnd-context";
import { PartsProvider } from "@/components/circuit/parts/parts-context";
import { PanelProvider } from "@/components/circuit/resizable-panel/resizable-panel-context";
import { EditorProvider } from "@/components/editor/editor-context";
import { ApiStatusProvider } from "@/components/simulation/api-status-context";
import { SimulatorProvider } from "@/components/simulation/simulator-context";
import { ReactFlowProvider } from "@xyflow/react";

export const StudioProviders = ({ children }) => {
  return (
    <ReactFlowProvider>
      <PanelProvider>
        <ApiStatusProvider>
          <SimulatorProvider>
            <EditorProvider>
              <PartsProvider>
                <DnDProvider>{children}</DnDProvider>
              </PartsProvider>
            </EditorProvider>
          </SimulatorProvider>
        </ApiStatusProvider>
      </PanelProvider>
    </ReactFlowProvider>
  );
};
