"use client";

import { ControlFields } from "@/components/circuit/operator/parts-manager/form-fields/controls";
import { InputField } from "@/components/circuit/operator/parts-manager/form-fields/input";
import { MetaFields } from "@/components/circuit/operator/parts-manager/form-fields/meta";
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
import { z } from "zod";

const PartAddForm = ({ closeDialog }) => {
  const { parts, addPart } = useParts();

  const uniqueNamePartSchema = partSchema.merge(
    z.object({
      name: z.string().refine((name) => !parts[name], { message: "Part name must be unique." }),
    }),
  );

  const handleSave = (values: z.infer<typeof uniqueNamePartSchema>) => {
    addPart(values);
    closeDialog();
  };

  const form = useForm<z.infer<typeof uniqueNamePartSchema>>({
    resolver: zodResolver(uniqueNamePartSchema),
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
              label="description"
              description="Description of the part (optional)"
              fieldName=""
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
              options={["promoter", "protein", "terminator"]}
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

            {category === "protein" && (
              <>
                <Separator />
                <MetaFields form={form} />
              </>
            )}
          </form>
        </ScrollArea>
        <DialogFooter>
          <Button variant="secondary" onClick={() => closeDialog()}>
            Cancel
          </Button>
          <Button variant="default" onClick={form.handleSubmit(handleSave)}>
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
              <Button variant="ghost" size="icon" className="p-0.5 w-7 h-7 hover:bg-black/5">
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
