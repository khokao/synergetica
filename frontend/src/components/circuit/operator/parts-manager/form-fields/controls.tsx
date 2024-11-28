import { PartsCommandList } from "@/components/circuit/operator/parts-manager/parts-command-list";
import { useParts } from "@/components/circuit/parts/parts-context";
import { Button } from "@/components/ui/button";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, Minus, Plus } from "lucide-react";
import { useFieldArray } from "react-hook-form";

export const ControlFields = ({ label, description, fieldName, form }) => {
  const { parts } = useParts();

  const { fields, append, remove } = useFieldArray({ name: fieldName, control: form.control });

  return (
    <div className="flex flex-col items-center space-y-0.5">
      <FormLabel className="w-full text-left">{label}</FormLabel>
      <FormDescription className="w-full text-left py-2">{description}</FormDescription>
      {fields.map((field, index) => {
        const nameError = form.formState.errors[fieldName]?.[index]?.name?.message;
        const typeError = form.formState.errors[fieldName]?.[index]?.type?.message;
        return (
          <FormItem key={field.id} className="w-full px-2">
            <div className="flex flex-row justify-between items-center w-full">
              <span>{index + 1}.</span>
              <FormField
                control={form.control}
                name={`${fieldName}.${index}.name`}
                render={({ field: fieldNameProps }) => (
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-[150px] justify-between">
                          {fieldNameProps.value ? (
                            Object.keys(parts).find((p) => p === fieldNameProps.value)
                          ) : (
                            <span className="text-neutral-500">Select part</span>
                          )}
                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[150px] p-0" align="center">
                        <PartsCommandList onSelect={(p) => form.setValue(`${fieldName}.${index}.name`, p)} />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                )}
              />
              <FormField
                control={form.control}
                name={`${fieldName}.${index}.type`}
                render={({ field: fieldTypeProps }) => (
                  <FormControl>
                    <Select onValueChange={fieldTypeProps.onChange} defaultValue={fieldTypeProps.value}>
                      <SelectTrigger className="w-[150px] font-medium data-[placeholder]:text-neutral-500">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="repression">repression</SelectItem>
                        <SelectItem value="activation">activation</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                )}
              />
              <Button variant="outline" size="icon" onClick={() => remove(index)} className="rounded-full w-7 h-7">
                <Minus />
              </Button>
            </div>
            <FormMessage>
              {nameError && <div>{nameError}</div>}
              {typeError && <div>{typeError}</div>}
            </FormMessage>
          </FormItem>
        );
      })}
      <Button
        variant="outline"
        size="icon"
        type="button"
        onClick={() => append({ name: "", type: "" })}
        className="rounded-full w-7 h-7"
      >
        <Plus />
      </Button>
    </div>
  );
};
