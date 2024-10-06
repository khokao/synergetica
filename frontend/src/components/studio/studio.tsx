"use client";

import { Circuit } from "@/components/circuit/circuit";
import { DnDProvider } from "@/components/circuit/dnd/context";
import { PanelProvider } from "@/components/circuit/panel/panel-context";
import { usePanelControls } from "@/components/hooks/use-panel-controls";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ReactFlowProvider } from "@xyflow/react";

export const Studio = () => {
  const { openPanels, panelRefs, togglePanel } = usePanelControls();

  return (
    <div className="h-full">
      <ReactFlowProvider>
        <PanelProvider value={{ openPanels, togglePanel }}>
          <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel
              defaultSize={0}
              collapsedSize={0}
              collapsible
              minSize={20.0}
              maxSize={30.0}
              ref={panelRefs.left}
            >
              <div className="h-full p-4">
                <span>Left Panel</span>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={100}>
              <DnDProvider>
                <Circuit />
              </DnDProvider>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel
              defaultSize={0}
              collapsedSize={0}
              collapsible
              minSize={20.0}
              maxSize={30.0}
              ref={panelRefs.right}
            >
              <div className="h-full p-4">
                <span>Right Panel</span>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </PanelProvider>
      </ReactFlowProvider>
    </div>
  );
};
