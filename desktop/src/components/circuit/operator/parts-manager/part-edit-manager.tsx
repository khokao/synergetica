"use client";

import { ControlFields } from "@/components/circuit/operator/parts-manager/form-fields/controls";
import { InputField } from "@/components/circuit/operator/parts-manager/form-fields/input";
import { ParamsFields } from "@/components/circuit/operator/parts-manager/form-fields/params";
import { PartsCommandList } from "@/components/circuit/operator/parts-manager/parts-command-list";
import { useParts } from "@/components/circuit/parts/parts-context";
import { partSchema } from "@/components/circuit/parts/schema";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

const PartEditFormDialog = ({ selectedPartName, setSelectedPartName }) => {
  const { parts, editPart } = useParts();
  const selectedPart = selectedPartName ? parts[selectedPartName] : null;

  const handleCancel = () => {
    setSelectedPartName(null);
  };

  const handleSave = (values: z.infer<typeof partSchema>) => {
    editPart(selectedPartName, values);
    setSelectedPartName(null);
  };

  const form = useForm<z.infer<typeof partSchema>>({
    resolver: zodResolver(partSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "Promoter", // placeholder
      sequence: "",
      controlBy: [],
      params: {},
    },
  });

  useEffect(() => {
    if (selectedPart) {
      form.reset(selectedPart as z.infer<typeof partSchema>);
    }
  }, [selectedPart, form]);

  return (
    <Dialog open={selectedPartName !== null} onOpenChange={handleCancel}>
      <DialogContent
        className="h-[85vh] flex flex-col"
        onOpenAutoFocus={(event) => event.preventDefault()}
        onCloseAutoFocus={(event) => event.preventDefault()}
        tabIndex={undefined}
      >
        <DialogHeader>
          <DialogTitle>Edit {selectedPartName}</DialogTitle>
          <DialogDescription>Update the specifications for this part.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <ScrollArea className="h-full">
            <form className="flex flex-col space-y-8 px-4" noValidate>
              <InputField
                label="DNA Sequence"
                description="Sequence of nucleotides (A, T, C, G)"
                fieldName="sequence"
                form={form}
                type="text"
                placeholder="atgcATGC"
              />

              {form.getValues("category") === "Promoter" && (
                <>
                  <Separator />
                  <ControlFields form={form} />
                </>
              )}

              {form.getValues("category") !== "Terminator" && (
                <>
                  <Separator />
                  <ParamsFields form={form} category={form.getValues("category")} />
                </>
              )}
            </form>
          </ScrollArea>
          <DialogFooter>
            <Button variant="secondary" onClick={handleCancel} data-testid="part-edit-cancel-button">
              Cancel
            </Button>
            <Button variant="default" onClick={form.handleSubmit(handleSave)} data-testid="part-edit-save-button">
              Save
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export const PartEditManager = () => {
  const [selectedPartName, setSelectedPartName] = useState<string | null>(null);

  return (
    <>
      <Popover>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="p-0.5 w-7 h-7 hover:bg-black/5"
                data-testid="part-edit-button"
              >
                <Pencil className="w-5 h-5 text-gray-500" />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Edit parts</p>
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

      <PartEditFormDialog selectedPartName={selectedPartName} setSelectedPartName={setSelectedPartName} />
    </>
  );
};
