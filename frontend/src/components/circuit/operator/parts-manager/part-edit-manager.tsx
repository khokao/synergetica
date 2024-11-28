"use client";

import { ControlFields } from "@/components/circuit/operator/parts-manager/form-fields/controls";
import { InputField } from "@/components/circuit/operator/parts-manager/form-fields/input";
import { MetaFields } from "@/components/circuit/operator/parts-manager/form-fields/meta";
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
      // @ts-ignore
      category: "",
      sequence: "",
      controlBy: [],
      controlTo: [],
      meta: null,
    },
  });

  useEffect(() => {
    if (selectedPart) {
      form.reset({
        name: selectedPart.name,
        description: selectedPart.description,
        category: selectedPart.category,
        sequence: selectedPart.sequence,
        controlBy: selectedPart.controlBy,
        controlTo: selectedPart.controlTo,
        meta: selectedPart.meta,
      });
    }
  }, [selectedPart, form]);

  return (
    <Dialog open={selectedPartName !== null} onOpenChange={handleCancel}>
      <DialogContent
        className="h-[70vh] flex flex-col"
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
            <form className="flex flex-col space-y-8 px-4">
              <InputField
                label="DNA Sequence"
                description="Sequence of nucleotides (A, T, C, G)"
                fieldName="sequence"
                form={form}
                type="text"
                placeholder="atgcATGC"
              />

              <Separator />

              <ControlFields
                label="Controlled By"
                description="Properties of the part that controls this part"
                fieldName="controlBy"
                form={form}
              />

              <Separator />

              <ControlFields
                label="Control To"
                description="Properties of the part controlled by this part"
                fieldName="controlTo"
                form={form}
              />

              {form.getValues("category") === "protein" && (
                <>
                  <Separator />
                  <MetaFields form={form} />
                </>
              )}
            </form>
          </ScrollArea>
          <DialogFooter>
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="default" onClick={form.handleSubmit(handleSave)}>
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
              <Button variant="ghost" size="icon" className="p-0.5 w-7 h-7 hover:bg-black/5">
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
