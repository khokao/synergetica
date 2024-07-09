"use client";

import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { type Node, useReactFlow } from "reactflow";

const updateNodeSubcategory = (nds: Node[], nodeId: string, subcategory: string): Node[] => {
  return nds.map((n) => {
    if (n.id === nodeId) {
      return {
        ...n,
        data: {
          ...n.data,
          nodeSubcategory: subcategory,
        },
      };
    }
    return n;
  });
};

export const NodeSelectMenu = ({ options, id }: { options: Array<Record<string, string>>; id: string }) => {
  const [selected, setSelected] = useState<Record<string, string>>(options[0]);
  const reactFlow = useReactFlow();

  const onOptionSelect = (option: Record<string, string>) => {
    setSelected(option);
    reactFlow.setNodes((nds) => updateNodeSubcategory(nds, id, option.name));
  };

  return (
    <Listbox value={selected} onChange={onOptionSelect}>
      <div className="relative mt-2">
        <ListboxButton className="relative w-full cursor-pointer bg-transparent py-1.4 pl-3 pr-10 text-left text-white font-extrabold tracking-widest shadow-sm border-transparent">
          <span className="flex items-center">
            <span className="ml-3 block truncate">{selected.name}</span>
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
            <ChevronDownIcon aria-hidden="true" className="h-6 w-6 text-white" />
          </span>
        </ListboxButton>

        <ListboxOptions className="absolute z-10 mt-1 max-h-56 w-full overflow-visible rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {options.map((option) => (
            <ListboxOption
              key={option.name}
              value={option}
              className="group relative cursor-pointer select-none py-2 pl-3 pr-9 text-gray-600 hover:bg-gray-100 hover:text-black"
            >
              <div className="flex items-center">
                <span className="ml-3 block truncate font-bold group-data-[selected]:text-indigo-600">
                  {option.name}
                </span>
              </div>

              <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 [.group:not([data-selected])_&]:hidden">
                <CheckIcon aria-hidden="true" className="h-5 w-5" />
              </span>

              <span className="absolute left-full top-0 ml-2 w-64 whitespace-normal rounded-lg bg-gray-50 shadow-lg border border-gray-300 px-4 py-4 text-gray-800 opacity-0 group-hover:opacity-100 transition-transform transform translate-y-2 pointer-events-none">
                <span className="block font-bold mb-2">{option.name}</span>
                <span className="block mb-2">{option.description}</span>
              </span>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
};
