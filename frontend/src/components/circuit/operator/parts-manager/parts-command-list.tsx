import { useParts } from "@/components/circuit/parts/parts-context";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { RiText } from "@remixicon/react";
import { CornerUpRight, RectangleHorizontal } from "lucide-react";

export const PartsCommandList = ({ onSelect }) => {
  const { promoterParts, proteinParts, terminatorParts } = useParts();

  const groups = [
    {
      heading: "Promoter",
      parts: promoterParts,
      Icon: CornerUpRight,
      iconClass: "text-blue-800",
    },
    {
      heading: "Protein",
      parts: proteinParts,
      Icon: RectangleHorizontal,
      iconClass: "text-green-800",
    },
    {
      heading: "Terminator",
      parts: terminatorParts,
      Icon: RiText,
      iconClass: "text-red-800",
    },
  ];

  return (
    <Command>
      <CommandInput placeholder="Search parts..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {groups.map(({ heading, parts, Icon, iconClass }) => (
          <CommandGroup key={heading} heading={heading}>
            {Object.keys(parts).map((p) => (
              // Need PopoverPrimitive.Close : https://github.com/shadcn-ui/ui/issues/1625#issuecomment-1785193833
              <PopoverPrimitive.Close key={p} className="w-full">
                <CommandItem key={p} onSelect={() => onSelect(p)}>
                  <Icon className={iconClass} />
                  <span>{p}</span>
                </CommandItem>
              </PopoverPrimitive.Close>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </Command>
  );
};
