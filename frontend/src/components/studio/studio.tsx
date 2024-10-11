"use client";

import { Circuit } from "@/components/circuit/circuit";
import { DnDProvider } from "@/components/circuit/dnd/dnd-context";
import { PanelProvider } from "@/components/circuit/resizable-panel/resizable-panel-context";
import { usePanelControls } from "@/components/circuit/hooks/use-panel-controls";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ReactFlowProvider } from "@xyflow/react";
// import { SimulatorProvider } from "@/components/simulation/simulator-context";
import { Simulation } from "@/components/simulation/simulation";
import { ConverterProvider } from "@/components/simulation/contexts/converter-context"
import { SimulatorProvider } from "@/components/simulation/contexts/simulator-context"

export const Studio = () => {
  const { openPanels, panelRefs, togglePanel } = usePanelControls();

  return (
    <div className="h-full">
      <ReactFlowProvider>
        <PanelProvider value={{ openPanels, togglePanel }}>
          <ConverterProvider>
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
                <SimulatorProvider>
                  <Simulation />
                </SimulatorProvider>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ConverterProvider>
        </PanelProvider>
      </ReactFlowProvider>
    </div>
  );
};
