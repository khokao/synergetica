import { Button } from "@/components/ui/button";
import { save } from "@tauri-apps/plugin-dialog";
import { writeTextFile } from "@tauri-apps/plugin-fs";
import { ArrowUpToLine } from "lucide-react";
import { toast } from "sonner";

export const ExportFastaButton = ({ chainSequences }: { chainSequences: Record<string, string> }) => {
  const handleExportFASTA = async () => {
    const fastaContent = Object.entries(chainSequences)
      .map(([id, sequence]) => {
        return `> ${id}\n${sequence}`;
      })
      .join("\n\n");

    try {
      const path = await save({
        filters: [{ name: "FASTA", extensions: ["fasta", "fa"] }],
        defaultPath: "sequence.fasta",
      });
      if (path) {
        await writeTextFile(path, fastaContent);
        toast.success("Exported FASTA file", {
          cancel: { label: "Close", onClick: () => {} },
        });
      }
    } catch (error) {
      toast.error("Failed to export FASTA file", {
        cancel: { label: "Close", onClick: () => {} },
      });
      console.error("Error while exporting FASTA file:", error);
    }
  };

  return (
    <Button onClick={handleExportFASTA}>
      <ArrowUpToLine className="mr-2 h-4 w-4" /> Export FASTA
    </Button>
  );
};
