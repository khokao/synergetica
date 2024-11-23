import { GenerationResultModal } from "@/components/generation/generation-result-modal";
import { useGeneratorData } from "@/components/generation/hooks/use-generator-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dna, Play } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

export const GenerationButtons = () => {
  const { data, snapshot, isMutating, generate, cancel } = useGeneratorData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGenerate = () => {
    const toastId = toast.loading("Generating...", {
      action: {
        label: (
          <div className="bg-neutral-900 text-neutral-50 hover:bg-neutral-900/90 rounded-md px-2 py-1">Cancel</div>
        ),
        onClick: (e) => {
          e.preventDefault(); // prevent the toast from closing
          cancel();
        },
      },
    });

    generate()
      .then(() => {
        toast.success("Generation successful", {
          id: toastId,
          action: {
            label: (
              <div className="bg-neutral-900 text-neutral-50 hover:bg-neutral-900/90 rounded-md px-2 py-1">
                View Result
              </div>
            ),
            onClick: () => {
              setIsModalOpen(true);
            },
          },
        });
      })
      .catch((error) => {
        console.error("Error occurred during generation:", error);
        toast.error(error === "Request was canceled" ? "Generation canceled" : "Generation failed", {
          id: toastId,
          action: { label: "Close", onClick: () => {} },
        });
      });
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
          disabled={isMutating}
          className="p-2 w-24 flex items-center"
          data-testid="run-button"
        >
          <div className="w-7 flex justify-center">
            <Play className="w-5" />
          </div>
          <span className="flex-1 text-center">Run</span>
        </Button>
        <Button
          size="default"
          onClick={() => setIsModalOpen(true)}
          disabled={!data}
          className="p-2 w-24 flex items-center"
          data-testid="result-button"
        >
          <div className="w-7 flex justify-center">
            <Dna className="w-5" />
          </div>
          <span className="flex-1 text-center">Result</span>
        </Button>
        <GenerationResultModal data={data} snapshot={snapshot} isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
      </CardContent>
    </Card>
  );
};
