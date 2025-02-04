import type { SnapshotData } from "@/components/generation/hooks/use-generator";
import { useGenerator } from "@/components/generation/hooks/use-generator";
import type { GeneratorResponseData } from "@/components/generation/hooks/use-generator-api";
import { GenerationResultDialog } from "@/components/generation/result-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Node } from "@xyflow/react";
import { produce } from "immer";
import { Dna, Play } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const getChainSequences = (nodes: Node[], response: GeneratorResponseData) => {
  const { protein_generated_sequences } = response;

  const updatedNodes = produce(nodes, (draft) => {
    for (const node of draft) {
      if (node.data.category === "Protein") {
        node.data.sequence = protein_generated_sequences[node.id] + node.data.sequence; // RBS is located just before the protein
      }
    }
  });

  const parentNodes = updatedNodes.filter((node) => node.type === "parent");

  const chainSequences: Record<string, string> = {};
  for (const parent of parentNodes) {
    const childNodes = updatedNodes
      .filter((node) => node.type === "child" && node.parentId === parent.id)
      .sort((a, b) => a.position.x - b.position.x);

    chainSequences[parent.id] = childNodes
      .map((child) => child.data.sequence)
      .join("")
      .toUpperCase();
  }

  return chainSequences;
};

export const GenerationButtons = () => {
  const { generate, cancel, isGenerating } = useGenerator();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [generationResult, setGenerationResult] = useState<{
    snapshot: SnapshotData;
    chainSequences: Record<string, string>;
  } | null>(null);

  const handleGenerate = async () => {
    const toastId = toast.loading("Generating...", {
      action: {
        label: <div className="bg-neutral-900 text-neutral-50 hover:bg-neutral-900/90 rounded-md">Cancel</div>,
        onClick: (e) => {
          e.preventDefault(); // prevent the toast from closing
          cancel();
        },
      },
    });

    try {
      const { snapshot, response } = await generate();
      const chainSequences = getChainSequences(snapshot.nodes, response);
      setGenerationResult({ snapshot: snapshot, chainSequences: chainSequences });

      toast.success("Generation successful", {
        id: toastId,
        action: {
          label: <div className="bg-neutral-900 text-neutral-50 hover:bg-neutral-900/90 rounded-md">View Result</div>,
          onClick: () => {
            setIsDialogOpen(true);
          },
        },
      });
    } catch (error) {
      console.error("Error occurred during generation:", error);
      toast.error(error?.message === "Request was canceled" ? "Generation canceled" : "Generation failed", {
        id: toastId,
        action: { label: "Close", onClick: () => {} },
      });
    }
  };

  return (
    <Card className="border-0 shadow-none h-full flex-col justify-center items-center py-2">
      <CardHeader className="flex justify-center items-center h-1/3">
        <CardTitle className="text-xl space-x-2 tracking-wide">
          <span>Generation</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center items-center space-x-4 h-2/3">
        <Button
          size="default"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="relative w-24 flex items-center"
          data-testid="generation-run-button"
        >
          <div className="absolute left-2 w-7 flex justify-center">
            <Play className="w-5" />
          </div>
          <span className="absolute left-11 flex-1 text-center">Run</span>
        </Button>

        <Button
          size="default"
          onClick={() => setIsDialogOpen(true)}
          disabled={!generationResult || isGenerating}
          className="relative w-24 flex items-center"
          data-testid="generation-result-button"
        >
          <div className="absolute left-2 w-7 flex justify-center">
            <Dna className="w-5" />
          </div>
          <span className="absolute left-10 flex-1 text-center">Result</span>
        </Button>

        <GenerationResultDialog generationResult={generationResult} isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} />
      </CardContent>
    </Card>
  );
};
