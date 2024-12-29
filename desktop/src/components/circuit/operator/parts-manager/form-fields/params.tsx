import { InputField } from "@/components/circuit/operator/parts-manager/form-fields/input";
import { FormDescription, FormLabel } from "@/components/ui/form";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

const promoterItems = [
  {
    label: "Ydef",
    description: "Ydef description",
    placeholder: "",
  },
];

const proteinItems = [
  {
    label: "Dp",
    description: "Dp description",
    placeholder: "",
  },
  {
    label: "TIRb",
    description: "TIRb description",
    placeholder: "",
  },
];

export const ParamsFields = ({ form, category }) => {
  const label = "Parameters";
  const fieldName = "params";

  const descriptionMap = {
    Promoter: "Promoter items description",
    Protein: "Protein items description",
  };

  const itemsMap = {
    Promoter: promoterItems,
    Protein: proteinItems,
  };

  return (
    <div className="space-y-2">
      <FormLabel className="w-full">{label}</FormLabel>
      <FormDescription className="w-full text-left mb-2">{descriptionMap[category]}</FormDescription>

      <div className="grid grid-cols-2  gap-4 py-1">
        {itemsMap[category].map((item) => (
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
