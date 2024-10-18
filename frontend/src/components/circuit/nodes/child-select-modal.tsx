import { CircuitEdgeTypes, CircuitNodeTypes, NODE_HEIGHT, TEMP_NODE_ID } from "@/components/circuit/constants";
import { PROMOTER_DATA, PROTEIN_DATA, TERMINATOR_DATA } from "@/components/circuit/nodes/constants";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ReactFlow, ReactFlowProvider, useReactFlow } from "@xyflow/react";
import { produce } from "immer";
import { ChevronDown, CircleCheck } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import { InformationCard } from "@/components/circuit/nodes/information-card";

const modalMap = {
  promoter: {
    title: "Select Promoter",
    underlineColor: "border-blue-800",
    highlightColor: "bg-blue-100",
    options: PROMOTER_DATA,
  },
  protein: {
    title: "Select Protein",
    underlineColor: "border-green-800",
    highlightColor: "bg-green-100",
    options: PROTEIN_DATA,
  },
  terminator: {
    title: "Select Terminator",
    underlineColor: "border-red-800",
    highlightColor: "bg-red-100",
    options: TERMINATOR_DATA,
  },
};

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
        fitView
        fitViewOptions={{ nodes: [{ id: id }], maxZoom: 0.5 }}
        nodesDraggable={false}
        nodesConnectable={false}
        nodesFocusable={false}
        edgesFocusable={false}
        elementsSelectable={false}
      />
    </ReactFlowProvider>
  );
};

const SelectMenu = ({ options, selected, handleSelect }) => {
  return (
    <Command className="flex flex-col flex-grow">
      <CommandInput placeholder="Search..." />
      <CommandList className="flex-grow overflow-y-auto mt-2">
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {options.map((o) => (
            <CommandItem key={o.nodePartsName} value={`${o.nodePartsName} ${o.description}`} onSelect={() => handleSelect(o)}>
              <div className="flex items-center justify-between w-full">
                <div>
                  <span className={`font-bold ${selected?.nodePartsName === o.nodePartsName ? "text-indigo-600" : ""}`}>{o.nodePartsName}</span>
                  <div className={`text-sm ${selected?.nodePartsName === o.nodePartsName ? "text-indigo-600" : "text-gray-500"}`}>
                    {o.description}
                  </div>
                </div>
                {selected?.nodePartsName === o.nodePartsName && <CircleCheck aria-hidden="true" className="h-5 w-5 text-indigo-600" />}
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

const Container = ({ children }) => (
  <div className="flex justify-between items-center h-1/3 px-2 py-2 bg-gray-50 rounded-b-xl">{children}</div>
);

const ChildSelectModalComponent = ({ id, data }) => {
  if (id === TEMP_NODE_ID) {
    return (
      <Container>
        <Button variant="ghost" className="flex justify-between items-center py-2 px-2 w-full">
          <span></span>
          <ChevronDown />
        </Button>
      </Container>
    );
  }

  const { nodeCategory, nodePartsName } = data;

  const reactflow = useReactFlow();

  const [isOpen, setIsOpen] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);

  const { title, underlineColor, highlightColor, options } = modalMap[nodeCategory];
  const selectedOption = options.find((option) => option.nodePartsName === nodePartsName);

  const handleSelect = useCallback(
    (option) => {
      const { getNodes, setNodes } = reactflow;
      const newNodes = produce(getNodes(), (draft) => {
        draft.forEach((node) => {
          if (node.id === id) {
            node.data.nodePartsName = option.nodePartsName;
            node.data.description = option.description;
            node.data.nodeSubcategory = option.nodeSubcategory;
            node.data.sequence = option.sequence;
            node.data.partsId = option.partsId;
            node.data.controlBy = option.controlBy;
            node.data.controlTo = option.controlTo;
            node.data.meta = option.meta;
          }
        });
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
      className={`flex justify-between items-center py-2 px-2 w-full hover:bg-gray-100 transition-colors duration-300 ${
        isHighlighted ? highlightColor : ""
      }`}
    >
      <span className="tracking-wider text-black font-extrabold text-lg">
        {selectedOption ? selectedOption.nodePartsName : ""}
      </span>
      <ChevronDown />
    </Button>
  );



  return (
    <Container>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {data.nodePartsName && !isOpen ? (
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
          className="bg-white shadow-lg p-6 rounded-2xl flex flex-col"
          aria-describedby={undefined}
          onOpenAutoFocus={(event) => event.preventDefault()}
          onCloseAutoFocus={(event) => event.preventDefault()}
        >
          <DialogHeader className="flex-shrink-0 flex justify-between items-center mb-4">
            <DialogTitle
              className={`text-xl font-semibold border-b-2 ${underlineColor} pb-2 pl-4 pr-4 mx-auto text-center`}
            >
              {title}
            </DialogTitle>
          </DialogHeader>

          <div className="border-2 border-gray-300 rounded-lg mb-4 flex-shrink-0" style={{ height: NODE_HEIGHT }}>
            <CircuitPreview id={id} />
          </div>
          <SelectMenu options={options} selected={selectedOption} handleSelect={handleSelect} />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export const ChildSelectModal = React.memo(ChildSelectModalComponent);
