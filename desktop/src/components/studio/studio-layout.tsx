import { Circuit } from "@/components/circuit/circuit";
import { usePanelContext } from "@/components/circuit/resizable-panel/resizable-panel-context";
import { CircuitEditor } from "@/components/editor/editor";
import { Simulation } from "@/components/simulation/simulation";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

export const StudioLayout = () => {
  const { panelRefs } = usePanelContext();

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full">
      <ResizablePanel
        defaultSize={0}
        collapsedSize={0}
        collapsible
        minSize={20.0}
        maxSize={30.0}
        // @ts-ignore
        ref={panelRefs.left}
        data-testid="left-panel"
      >
        <CircuitEditor />
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel defaultSize={100} data-testid="center-panel">
        <Circuit />
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel
        defaultSize={0}
        collapsedSize={0}
        collapsible
        minSize={20.0}
        maxSize={30.0}
        // @ts-ignore
        ref={panelRefs.right}
        data-testid="right-panel"
      >
        <Simulation />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
