import { CircuitEdgeTypes, CircuitNodeTypes, TEMP_NODE_ID } from "@/components/circuit/constants";
import { InformationCard } from "@/components/circuit/nodes/information-card";
import { useParts } from "@/components/circuit/parts/parts-context";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";
import {
  Background,
  BackgroundVariant,
  ConnectionMode,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import { produce } from "immer";
import { ChevronDown } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";

const CircuitPreview = ({ id }) => {
  const reactflow = useReactFlow();

  const { getNodes, getEdges } = reactflow;
  const nodes = getNodes();
  const edges = getEdges();

  return (
    <ReactFlowProvider>
      <ReactFlow
        id="select-modal-preview-flow"
        nodes={nodes}
        edges={edges}
        proOptions={{ hideAttribution: true }}
        nodeTypes={CircuitNodeTypes}
        edgeTypes={CircuitEdgeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        fitViewOptions={{ nodes: [{ id: id }], maxZoom: 0.5 }}
        nodesDraggable={false}
        nodesConnectable={false}
        nodesFocusable={false}
        edgesFocusable={false}
        elementsSelectable={false}
        className="border-2 border-gray-300 rounded-lg p-4"
        data-testid="select-modal-preview-flow"
      >
        <Background variant={BackgroundVariant.Dots} />
      </ReactFlow>
    </ReactFlowProvider>
  );
};

const SelectMenu = ({ options, selectedOption, handleSelect }) => {
  return (
    <Command className="flex flex-col h-full w-full" data-testid="select-menu">
      <CommandInput placeholder="Search..." />
      <CommandList className="flex-grow overflow-y-auto mt-2 max-h-[60vh]">
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup className="h-full">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {options.map((o) => {
              const isSelected = selectedOption && o.name === selectedOption.name;
              return (
                <CommandItem key={o.name} value={`${o.name} ${o.description}`} onSelect={() => handleSelect(o)} asChild>
                  <div className={`cursor-pointer ${isSelected ? "border-2 border-gray-500 bg-gray-100" : ""}`}>
                    <InformationCard data={o} />
                  </div>
                </CommandItem>
              );
            })}
          </div>
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

const Container = ({ children }) => (
  <div className="flex justify-between items-center h-1/3 px-2 py-2 bg-gray-50">{children}</div>
);

const ChildSelectModalComponent = ({ id, data }) => {
  if (id === TEMP_NODE_ID) {
    return (
      <Container>
        <Button variant="ghost" className="flex justify-between items-center py-2 px-2 w-full">
          <span />
          <ChevronDown />
        </Button>
      </Container>
    );
  }

  const { category, name } = data;

  const reactflow = useReactFlow();
  const { promoterParts, proteinParts, terminatorParts } = useParts();

  const modalMap = {
    Promoter: {
      title: "Select Promoter",
      underlineColor: "border-promoter-800",
      highlightColor: "text-promoter-600",
      options: Object.values(promoterParts),
    },
    Protein: {
      title: "Select Protein",
      underlineColor: "border-protein-800",
      highlightColor: "text-protein-600",
      options: Object.values(proteinParts),
    },
    Terminator: {
      title: "Select Terminator",
      underlineColor: "border-terminator-800",
      highlightColor: "text-terminator-600",
      options: Object.values(terminatorParts),
    },
  };

  const [isOpen, setIsOpen] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);

  const { title, underlineColor, highlightColor, options } = modalMap[category];
  const selectedOption = options.find((option) => option.name === name);

  const handleSelect = useCallback(
    (option) => {
      const { getNodes, setNodes } = reactflow;
      const newNodes = produce(getNodes(), (draft) => {
        for (const node of draft) {
          if (node.id === id) {
            node.data.name = option.name;
            node.data.description = option.description;
            node.data.sequence = option.sequence;
            node.data.controlBy = option.controlBy;
            node.data.controlTo = option.controlTo;
            node.data.meta = option.meta;
          }
        }
      });
      setNodes(newNodes);
      setIsOpen(false);
      setIsHighlighted(true);
    },
    [id, reactflow],
  );

  useEffect(() => {
    if (isHighlighted) {
      const timer = setTimeout(() => {
        setIsHighlighted(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isHighlighted]);

  const buttonContent = (
    <Button
      variant="ghost"
      className="flex justify-between items-center py-2 px-2 w-full hover:bg-gray-100"
      data-testid="select-modal-button"
    >
      <span
        className={`tracking-wider text-black font-extrabold text-lg duration-300 ${isHighlighted ? highlightColor : ""}`}
      >
        {selectedOption ? selectedOption.name : ""}
      </span>
      <ChevronDown />
    </Button>
  );

  return (
    <Container>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {data.name && !isOpen ? (
          <HoverCard>
            <HoverCardTrigger asChild>
              <DialogTrigger asChild>{buttonContent}</DialogTrigger>
            </HoverCardTrigger>
            <HoverCardContent className="p-0 border-0">
              <InformationCard data={data} />
            </HoverCardContent>
          </HoverCard>
        ) : (
          <DialogTrigger asChild>{buttonContent}</DialogTrigger>
        )}
        <DialogContent
          className="flex flex-col max-w-none max-h-screen w-[80vw] h-auto overflow-auto"
          aria-describedby={undefined}
          onOpenAutoFocus={(event) => event.preventDefault()}
          onCloseAutoFocus={(event) => event.preventDefault()}
        >
          <DialogHeader className="flex-shrink-0 flex justify-between items-center">
            <DialogTitle className={`text-xl font-semibold border-b-2 ${underlineColor} pb-2 px-4 mx-auto text-center`}>
              {title}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-row h-full w-full min-h-0">
            <div className="flex flex-col p-4 w-1/3 overflow-auto">
              <CircuitPreview id={id} />
            </div>
            <Separator orientation="vertical" />
            <div className="flex flex-col p-4 w-2/3 overflow-auto">
              <SelectMenu options={options} selectedOption={selectedOption} handleSelect={handleSelect} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export const ChildSelectModal = React.memo(ChildSelectModalComponent);
