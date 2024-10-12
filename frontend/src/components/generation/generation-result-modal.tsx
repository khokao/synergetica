import React from "react";
import { ReactFlow, ReactFlowProvider } from "@xyflow/react";
import { Dna, ArrowUpToLine } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { produce } from "immer";
import { CircuitEdgeTypes, CircuitNodeTypes } from "@/components/circuit/constants";
import { useConverter } from "@/components/simulation/contexts/converter-context";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import { save } from "@tauri-apps/api/dialog";
import { writeTextFile } from "@tauri-apps/api/fs";


const CircuitPreview = ({ snapshot }) => {
  if (!snapshot) return null;

  const { nodes, edges } = snapshot;

  const newNodes = produce((draft) => {
    draft.forEach((node) => {
      if (node.type === "parent") {
        node.data.showParentId = true;
      }
    });
  })(nodes);

  return (
    <ReactFlowProvider>
      <ReactFlow
        id="generation-modal-preview-flow"
        nodes={newNodes}
        edges={edges}
        proOptions={{ hideAttribution: true }}
        nodeTypes={CircuitNodeTypes}
        edgeTypes={CircuitEdgeTypes}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        nodesFocusable={false}
        edgesFocusable={false}
        elementsSelectable={false}
        className="rounded-lg shadow-md border-2 border-gray-100"
      />
    </ReactFlowProvider>
  );
};


const ParameterPreview = ({ snapshot }) => {
  if (!snapshot) return null;

  const { proteinParameter } = snapshot;
  const { convertResult } = useConverter();

  if (!convertResult) {
    return null;
  }

  const proteinEntries = Object.entries(convertResult.protein_id2name);

  return (
    <Card className="h-full border-0 shadow-none pt-4">
      <CardContent className="h-full">
        <ScrollArea className="h-full">
          <div className="grid grid-cols-2 gap-4">
            {proteinEntries.map(([id, name], index) => (
              <div
                key={id}
                className="flex items-center mb-4 pr-4"
              >
                <Label htmlFor={`slider-${id}`} className="w-40 pr-2 flex items-center">
                  <span
                    className="inline-block w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: `hsl(var(--chart-${(index % 5) + 1}))` }}
                  />
                  {name}
                </Label>
                <Slider
                  id={`slider-${id}`}
                  min={1}
                  max={1000}
                  step={1}
                  defaultValue={[proteinParameter[id]]}
                  disabled={true}
                  className="w-full"
                />
                <span className="w-20 text-right">{proteinParameter[id]}</span>
              </div>
            ))}
          </div>
          <ScrollBar />
        </ScrollArea>
      </CardContent>
    </Card>
  );
};


const SequencePreview = ({ data }) => {
  const sequenceIds = Object.keys(data.parent2child_details);

  return (
    <Table>
      <TableCaption>Generation Result Table</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Sequence ID</TableHead>
          <TableHead>Sequence</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sequenceIds.map((id) => {
          const concatenatedSequences = data.parent2child_details[id]
            .map((item) => item.sequence)
            .join("");

          return (
            <TableRow key={id}>
              <TableCell>{id}</TableCell>
              <TableCell className="truncate max-w-xs">{concatenatedSequences}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};


const ExportButton = ({ data }) => {
  const handleExportFASTA = async () => {
    if (!data) return;

    const fastaContent = Object.keys(data.parent2child_details)
      .map((groupId) => {
        const concatenatedSequences = data.parent2child_details[groupId].map((sequence) => sequence.sequence).join("");
        return `> ${groupId}\n${concatenatedSequences}`;
      })
      .join("\n\n");

    try {
      const filePath = await save({
        filters: [{ name: "FASTA", extensions: ["fasta", "fa"] }],
        defaultPath: "sequence.fasta",
      });
      if (filePath) {
        await writeTextFile(filePath, fastaContent);
      }
    } catch (error) {
      console.error("Error while exporting FASTA file:", error);
    }
  };

  return (
    <Button onClick={handleExportFASTA}>
      <ArrowUpToLine className="mr-2 h-4 w-4" /> Export FASTA
    </Button>
  )
}

export const GenerationResultModal = ({ data, snapshot }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          disabled={!data}
        >
          <Dna className='w-5 h-5'/>
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined} className="max-w-none h-[80vh] w-[80vw] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center tracking-wide space-x-2">
            <span>Generation</span>
            <span>Summary</span>
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-row flex-1">
          <div className="flex flex-col flex-1 p-2">
            <div className="flex-grow-[9] pb-4 pl-2 pr-2">
              <CircuitPreview snapshot={snapshot} />
            </div>
            <Separator orientation="horizontal"/>
            <div className="flex-grow-[1]">
              <ParameterPreview snapshot={snapshot} />
            </div>
          </div>
          <Separator orientation="vertical" />
          <div className="flex flex-col flex-1 p-2">
            <div className="flex-grow-[11]">
              <SequencePreview data={data}/>
            </div>
            <div className="flex-grow-[1] flex justify-center items-center">
              <ExportButton data={data}/>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
