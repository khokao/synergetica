"use client";

import { ControlFields } from "@/components/circuit/operator/parts-manager/form-fields/controls";
import { InputField } from "@/components/circuit/operator/parts-manager/form-fields/input";
import { ParamsFields } from "@/components/circuit/operator/parts-manager/form-fields/params";
import { SelectField } from "@/components/circuit/operator/parts-manager/form-fields/select";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { zodResolver } from "@hookform/resolvers/zod";
import { CirclePlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

const PartAddForm = ({ closeDialog }) => {
  const { parts, addPart } = useParts();

  const uniqueNamePartSchema = partSchema.superRefine((data, ctx) => {
    if (!data.name || data.name.trim().length === 0) {
      ctx.addIssue({
        code: "custom",
        message: "Name string cannot be empty",
        path: ["name"],
      });
    }
    if (parts[data.name]) {
      ctx.addIssue({
        code: "custom",
        message: "Part name must be unique.",
        path: ["name"],
      });
    }
  });

  const handleSave = (values: z.infer<typeof uniqueNamePartSchema>) => {
    addPart(values);
    closeDialog();
  };

  const form = useForm<z.infer<typeof uniqueNamePartSchema>>({
    resolver: zodResolver(uniqueNamePartSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "Promoter", // placeholder
      sequence: "",
      controlBy: [],
      params: {},
    },
  });

  const category = form.watch("category");

  return (
    <>
      <DialogHeader>
        <DialogTitle>Add New Part</DialogTitle>
        <DialogDescription>Fill in the necessary information to create a new part.</DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <ScrollArea className="h-full">
          <form className="flex flex-col space-y-8 px-4">
            <InputField
              label="Name"
              description="Unique name of the part"
              fieldName="name"
              form={form}
              type="text"
              placeholder="New part name"
            />

            <Separator />

            <InputField
              label="Description"
              description="Description of the part (optional)"
              fieldName="description"
              form={form}
              type="text"
              placeholder="New part description."
            />

            <Separator />

            <SelectField
              label="Category"
              description="Category of the part"
              fieldName="category"
              form={form}
              placeholder="Select category"
              options={["Promoter", "Protein", "Terminator"]}
            />

            <Separator />

            <InputField
              label="DNA Sequence"
              description="Sequence of nucleotides (A, T, C, G)"
              fieldName="sequence"
              form={form}
              type="text"
              placeholder="atgcATGC"
            />

            <Separator />

            {category === "Promoter" && (
              <>
                <Separator />
                <ControlFields form={form} />
              </>
            )}

            {category !== "Terminator" && (
              <>
                <Separator />
                <ParamsFields form={form} category={form.getValues("category")} />
              </>
            )}
          </form>
        </ScrollArea>
        <DialogFooter>
          <Button variant="secondary" onClick={() => closeDialog()} data-testid="part-add-cancel-button">
            Cancel
          </Button>
          <Button variant="default" onClick={form.handleSubmit(handleSave)} data-testid="part-add-save-button">
            Save
          </Button>
        </DialogFooter>
      </Form>
    </>
  );
};

export const PartAddManager = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="p-0.5 w-7 h-7 hover:bg-black/5"
                data-testid="part-add-button"
              >
                <CirclePlus className="w-5 h-5 text-gray-500" />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add parts</p>
          </TooltipContent>
        </Tooltip>
        <DialogContent
          className="h-[70vh] flex flex-col"
          onOpenAutoFocus={(event) => event.preventDefault()}
          onCloseAutoFocus={(event) => event.preventDefault()}
          tabIndex={undefined} // fix focus issue: https://github.com/shadcn-ui/ui/issues/1288#issuecomment-1819808273
        >
          <PartAddForm closeDialog={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};
