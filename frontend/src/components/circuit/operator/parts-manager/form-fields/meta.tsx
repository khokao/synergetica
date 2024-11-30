import { InputField } from "@/components/circuit/operator/parts-manager/form-fields/input";
import { FormDescription, FormLabel } from "@/components/ui/form";

export const MetaFields = ({ form }) => {
  const label = "Meta";
  const description = "Meta description";
  const fieldName = "meta";

  const items = [
    {
      label: "Pmax",
      description: "Pmax description",
      fieldName: `${fieldName}.Pmax`,
      placeholder: "",
    },
    {
      label: "Ymax",
      description: "Ymax description",
      fieldName: `${fieldName}.Ymax`,
      placeholder: "",
    },
    {
      label: "Ymin",
      description: "Ymin description",
      fieldName: `${fieldName}.Ymin`,
      placeholder: "",
    },
    {
      label: "K",
      description: "K description",
      fieldName: `${fieldName}.K`,
      placeholder: "",
    },
    {
      label: "n",
      description: "n description",
      fieldName: `${fieldName}.n`,
      placeholder: "",
    },
    {
      label: "Dp",
      description: "Dp description",
      fieldName: `${fieldName}.Dp`,
      placeholder: "",
    },
  ];

  return (
    <div>
      <FormLabel>{label}</FormLabel>
      <FormDescription>{description}</FormDescription>
      <div className="grid grid-cols-2 gap-4 px-4 py-1">
        {items.map((item, index) => (
          <InputField
            key={item.label}
            label={item.label}
            description={item.description}
            fieldName={item.fieldName}
            form={form}
            type="number"
            placeholder={item.placeholder}
          />
        ))}
      </div>
    </div>
  );
};
