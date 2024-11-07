"use client";

import { Circuit } from "@/components/circuit/circuit";
import { DnDProvider } from "@/components/circuit/dnd/dnd-context";
import { usePanelControls } from "@/components/circuit/hooks/use-panel-controls";
import { PanelProvider } from "@/components/circuit/resizable-panel/resizable-panel-context";
import { CircuitEditor } from "@/components/editor/editor";
import { EditorProvider } from "@/components/editor/editor-context";
import { ConverterProvider } from "@/components/simulation/contexts/converter-context";
import { ProteinParameterProvider } from "@/components/simulation/contexts/protein-parameter-context";
import { SimulatorProvider } from "@/components/simulation/contexts/simulator-context";
import { Simulation } from "@/components/simulation/simulation";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ReactFlowProvider } from "@xyflow/react";

export const Studio = () => {
  const { openPanels, panelRefs, togglePanel } = usePanelControls();

  return (
    <div className="h-full">
      <ReactFlowProvider>
        <PanelProvider value={{ openPanels, togglePanel }}>
          <ConverterProvider>
            <ProteinParameterProvider>
              <ResizablePanelGroup direction="horizontal" className="h-full">
                <EditorProvider>
                  <ResizablePanel
                    defaultSize={0}
                    collapsedSize={0}
                    collapsible
                    minSize={20.0}
                    maxSize={30.0}
                    // @ts-ignore
                    ref={panelRefs.left}
                  >
                    <CircuitEditor />
                  </ResizablePanel>
                  <ResizableHandle withHandle />
                  <ResizablePanel defaultSize={100}>
                    <DnDProvider>
                      <Circuit />
                    </DnDProvider>
                  </ResizablePanel>
                </EditorProvider>
                <ResizableHandle withHandle />
                <ResizablePanel
                  defaultSize={0}
                  collapsedSize={0}
                  collapsible
                  minSize={20.0}
                  maxSize={30.0}
                  // @ts-ignore
                  ref={panelRefs.right}
                >
                  <SimulatorProvider>
                    <Simulation />
                  </SimulatorProvider>
                </ResizablePanel>
              </ResizablePanelGroup>
            </ProteinParameterProvider>
          </ConverterProvider>
        </PanelProvider>
      </ReactFlowProvider>
    </div>
  );
};
