import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export const InputField = ({ label, description, fieldName, form, type }) => (
  <FormField
    control={form.control}
    name={fieldName}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormDescription>{description}</FormDescription>
        <FormControl>
          <form noValidate>
            <Input
              type={type}
              className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              {...field}
            />
          </form>
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);
