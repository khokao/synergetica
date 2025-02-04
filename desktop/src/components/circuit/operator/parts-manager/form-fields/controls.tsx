import { InputField } from "@/components/circuit/operator/parts-manager/form-fields/input";
import { PartsCommandList } from "@/components/circuit/operator/parts-manager/parts-command-list";
import { useParts } from "@/components/circuit/parts/parts-context";
import { Button } from "@/components/ui/button";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronDown, Info, Plus, X } from "lucide-react";
import { useFieldArray } from "react-hook-form";

const controlParamItems = [
  { label: "Ymax", description: "Maximum expression rate" },
  { label: "Ymin", description: "Minimum expression rate" },
  { label: "K", description: "Michaelis-Menten constant" },
  { label: "n", description: "Hill coefficient" },
];

export const ControlFields = ({ form }) => {
  const fieldName = "controlBy";

  const { parts } = useParts();
  const { fields, append, remove } = useFieldArray({
    name: fieldName,
    control: form.control,
  });

  return (
    <div className="space-y-2">
      <FormLabel className="w-full">Controlled By</FormLabel>
      <FormDescription className="w-full text-left mb-2">
        Interactions for proteins controlling this promoter.
      </FormDescription>

      {fields.map((field, index) => {
        const nameError = form.formState.errors[fieldName]?.[index]?.name?.message;
        const typeError = form.formState.errors[fieldName]?.[index]?.type?.message;

        const ymaxError = form.formState.errors[fieldName]?.[index]?.params?.Ymax?.message;
        const yminError = form.formState.errors[fieldName]?.[index]?.params?.Ymin?.message;
        const kError = form.formState.errors[fieldName]?.[index]?.params?.K?.message;
        const nError = form.formState.errors[fieldName]?.[index]?.params?.n?.message;

        return (
          <FormItem
            key={field.id}
            className="
              w-full mb-3
              bg-white
              shadow-sm
              rounded-lg
              border border-gray-200
              px-4 py-3
              hover:shadow-md
              transition-all
            "
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">{`# ${index + 1}`}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
                className="rounded-full w-7 h-7 hover:bg-gray-100 text-gray-500"
                data-testid="field-array-remove-button"
                title="Remove"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex flex-row items-start gap-6 mb-3">
              <FormField
                control={form.control}
                name={`${fieldName}.${index}.name`}
                render={({ field: fieldNameProps }) => (
                  <FormControl>
                    <div className="flex flex-col">
                      <div className="flex items-center mb-1">
                        <span className="text-sm font-medium mr-1 text-gray-700">name</span>
                      </div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-[180px] justify-between text-sm">
                            {fieldNameProps.value ? (
                              Object.keys(parts).find((p) => p === fieldNameProps.value)
                            ) : (
                              <span className="text-neutral-500">Select part</span>
                            )}
                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[180px] p-0" align="center">
                          <PartsCommandList
                            onSelect={(p) => form.setValue(`${fieldName}.${index}.name`, p)}
                            includeCategories={["Protein"]}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </FormControl>
                )}
              />

              <FormField
                control={form.control}
                name={`${fieldName}.${index}.type`}
                render={({ field: fieldTypeProps }) => (
                  <FormControl>
                    <div className="flex flex-col">
                      <div className="flex items-center mb-1">
                        <span className="text-sm font-medium mr-1 text-gray-700">type</span>
                      </div>
                      <Select onValueChange={fieldTypeProps.onChange} defaultValue={fieldTypeProps.value}>
                        <SelectTrigger className="w-[180px] font-medium data-[placeholder]:text-neutral-500 text-sm">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Repression">Repression</SelectItem>
                          <SelectItem value="Activation">Activation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </FormControl>
                )}
              />
            </div>

            <div className="grid grid-cols-4 gap-4 py-1">
              {controlParamItems.map((paramItem) => (
                <div key={paramItem.label} className="flex flex-col">
                  <div className="flex items-center mb-1">
                    <span className="text-sm font-medium mr-1 text-gray-700">{paramItem.label}</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{paramItem.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <InputField
                    label=""
                    description=""
                    fieldName={`${fieldName}.${index}.params.${paramItem.label}`}
                    form={form}
                    type="number"
                    placeholder=""
                    showErrorMessage={false}
                  />
                </div>
              ))}
            </div>

            <FormMessage>
              {nameError && <div className="text-red-600 text-sm">{nameError}</div>}
              {typeError && <div className="text-red-600 text-sm">{typeError}</div>}

              {ymaxError && <div className="text-red-600 text-sm">{ymaxError}</div>}
              {yminError && <div className="text-red-600 text-sm">{yminError}</div>}
              {kError && <div className="text-red-600 text-sm">{kError}</div>}
              {nError && <div className="text-red-600 text-sm">{nError}</div>}
            </FormMessage>
          </FormItem>
        );
      })}

      <div className="flex justify-center">
        <Button
          variant="outline"
          size="icon"
          type="button"
          onClick={() => append({ name: "", type: "", params: {} })}
          className="rounded-full w-7 h-7"
          data-testid="field-array-append-button"
        >
          <Plus />
        </Button>
      </div>
    </div>
  );
};
