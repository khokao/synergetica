import { Button } from "@/components/ui/button";
import { save } from "@tauri-apps/plugin-dialog";
import { writeTextFile } from "@tauri-apps/plugin-fs";
import { ArrowUpToLine } from "lucide-react";
import type React from "react";

export const ExportButton = ({ data }) => {
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
  );
};
