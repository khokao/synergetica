import { PartsCommandList } from "@/components/circuit/operator/parts-manager/parts-command-list";
import { useParts } from "@/components/circuit/parts/parts-context";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CircleMinus } from "lucide-react";
import { useState } from "react";

const PartDeleteDialog = ({ selectedPartName, setSelectedPartName }) => {
  const { deletePart } = useParts();

  const handleCancel = () => {
    setSelectedPartName(null);
  };

  const handleDelete = () => {
    deletePart(selectedPartName);
    setSelectedPartName(null);
  };

  return (
    <Dialog open={selectedPartName !== null} onOpenChange={handleCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {selectedPartName}</DialogTitle>
          <DialogDescription>Are you sure you want to delete this part?</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="default" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const PartDeleteManager = () => {
  const [selectedPartName, setSelectedPartName] = useState<string | null>(null);

  return (
    <>
      <Popover>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="p-0.5 w-7 h-7 hover:bg-black/5">
                <CircleMinus className="w-5 h-5 text-gray-500" />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete parts</p>
          </TooltipContent>
        </Tooltip>
        <PopoverContent
          className="w-[150px] p-0"
          side="top"
          align="center"
          onOpenAutoFocus={(event) => event.preventDefault()}
          onCloseAutoFocus={(event) => event.preventDefault()}
        >
          <PartsCommandList onSelect={setSelectedPartName} />
        </PopoverContent>
      </Popover>

      {selectedPartName && (
        <PartDeleteDialog selectedPartName={selectedPartName} setSelectedPartName={setSelectedPartName} />
      )}
    </>
  );
};
