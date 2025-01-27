import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const SelectField = ({ label, description, fieldName, form, placeholder, options }) => (
  <FormField
    control={form.control}
    name={fieldName}
    render={({ field: fieldTypeProps }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormDescription>{description}</FormDescription>
        <FormControl>
          <Select onValueChange={fieldTypeProps.onChange} value={fieldTypeProps.value}>
            <SelectTrigger className="font-medium data-[placeholder]:text-neutral-500">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option, index) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);
