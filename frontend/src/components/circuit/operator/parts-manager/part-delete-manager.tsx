import { useParts } from "@/components/circuit/parts/parts-context";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { RiText } from "@remixicon/react";
import { CircleMinus, CornerUpRight, RectangleHorizontal } from "lucide-react";
import { useState } from "react";

export const PartDeleteManager = () => {
  const { promoterParts, proteinParts, terminatorParts, deletePart } = useParts();

  const [selectedPart, setSelectedPart] = useState<string | null>(null);

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
        <PopoverContent className="w-[150px] p-0" side="top" align="center">
          <Command>
            <CommandInput placeholder="Search parts..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Promoter">
                {Object.keys(promoterParts).map((p) => (
                  <CommandItem
                    key={p}
                    onSelect={() => {
                      setSelectedPart(p);
                    }}
                  >
                    <CornerUpRight className="text-blue-800" />
                    <span>{p}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Protein">
                {Object.keys(proteinParts).map((p) => (
                  <CommandItem
                    key={p}
                    onSelect={() => {
                      setSelectedPart(p);
                    }}
                  >
                    <RectangleHorizontal className="text-green-800" />
                    <span>{p}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Terminator">
                {Object.keys(terminatorParts).map((p) => (
                  <CommandItem
                    key={p}
                    onSelect={() => {
                      setSelectedPart(p);
                    }}
                  >
                    <RiText className="text-red-800" />
                    <span>{p}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedPart && (
        <AlertDialog open={true} onOpenChange={() => setSelectedPart(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{selectedPart} will be deleted</AlertDialogTitle>
              <AlertDialogDescription>This operation cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setSelectedPart(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  deletePart(selectedPart);
                  setSelectedPart(null);
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};
