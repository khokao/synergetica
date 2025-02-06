import { CATEGORY_CONFIG } from "@/components/circuit/constants";
import { useParts } from "@/components/circuit/parts/parts-context";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import * as PopoverPrimitive from "@radix-ui/react-popover";

export const PartsCommandList = ({ onSelect, includeCategories = ["Promoter", "Protein", "Terminator"] }) => {
  const { promoterParts, proteinParts, terminatorParts } = useParts();

  const partsMap = {
    Promoter: promoterParts,
    Protein: proteinParts,
    Terminator: terminatorParts,
  };

  const groups = includeCategories.map((category) => {
    return {
      category,
      parts: partsMap[category] || {},
      ...CATEGORY_CONFIG[category],
    };
  });

  return (
    <Command>
      <CommandInput placeholder="Search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {groups.map(({ category, parts, icon: Icon, iconColor }) => (
          <CommandGroup key={category} heading={category}>
            {Object.keys(parts).map((p) => (
              // Need PopoverPrimitive.Close : https://github.com/shadcn-ui/ui/issues/1625#issuecomment-1785193833
              <CommandItem key={p} onSelect={() => onSelect(p)}>
                <PopoverPrimitive.Close key={p} className="flex flex-row justify-center items-center space-x-2">
                  {Icon && <Icon className={iconColor} />}
                  <span>{p}</span>
                </PopoverPrimitive.Close>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </Command>
  );
};
