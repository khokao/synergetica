import { InputField } from "@/components/circuit/operator/parts-manager/form-fields/input";
import { FormDescription, FormLabel } from "@/components/ui/form";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

const categoryConfig = {
  Promoter: {
    description: "Promoter parameters",
    params: [
      {
        label: "Ydef",
        description: "Default expression rate w/o regulator",
        placeholder: "",
      },
    ],
  },
  Protein: {
    description: "Protein parameters",
    params: [
      {
        label: "Dp",
        description: "Protein degradation rate",
        placeholder: "",
      },
      {
        label: "TIRb",
        description: "Baseline RBS strength",
        placeholder: "",
      },
    ],
  },
};

export const ParamsFields = ({ form, category }) => {
  const label = "Parameters";
  const fieldName = "params";

  if (!categoryConfig[category]) return null;

  const { description, params } = categoryConfig[category];

  return (
    <div className="space-y-2">
      <FormLabel className="w-full">{label}</FormLabel>
      <FormDescription className="w-full text-left mb-2">{description}</FormDescription>

      <div className="grid grid-cols-2 gap-4 py-1">
        {params.map((item) => (
          <div key={item.label} className="flex flex-col">
            <div className="flex items-center mb-1">
              <span className="text-sm font-medium mr-1 text-gray-700">{item.label}</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info
                    className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer"
                    data-testid={`info-icon-${item.label}`}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{item.description}</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <InputField
              label=""
              description=""
              fieldName={`${fieldName}.${item.label}`}
              form={form}
              type="number"
              placeholder={item.placeholder}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
