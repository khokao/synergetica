"use client";

import type { OptionData } from "@/components/GUI/CustomNode";
import { promoterCommandPaletteOptions } from "@/components/GUI/nodes/promoterNode";
import { proteinCommandPaletteOptions } from "@/components/GUI/nodes/proteinNode";
import { terminatorCommandPaletteOptions } from "@/components/GUI/nodes/terminatorNode";
import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { CheckCircleIcon, ChevronUpDownIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { Fragment, useState } from "react";
import { type Node, useReactFlow } from "reactflow";

const commandPaletteOptions: Record<string, OptionData[]> = {
  promoter: promoterCommandPaletteOptions,
  protein: proteinCommandPaletteOptions,
  terminator: terminatorCommandPaletteOptions,
};

export const updateNodeMetadata = (nds: Node[], nodeId: string, option: OptionData): Node[] => {
  return nds.map((n) => {
    if (n.id === nodeId) {
      return {
        ...n,
        data: {
          ...n.data,
          nodeSubcategory: option.subcategory,
          nodePartsName: option.name,
          sequence: option.sequence,
          partsId: option.partsId,
          controlBy: option.controlBy,
          controlTo: option.controlTo,
          meta: option.meta,
        },
      };
    }
    return n;
  });
};

export const NodeCommandPalette = ({
  nodeCategory,
  nodePartsName,
  nodeId,
}: { nodeCategory: string; nodePartsName: string; nodeId: string }) => {
  const options = commandPaletteOptions[nodeCategory];
  const initSelected = options.find((option) => option.name === nodePartsName);

  const [selected, setSelected] = useState<OptionData>(initSelected);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const reactFlow = useReactFlow();

  const onOptionSelect = (option: OptionData) => {
    setSelected(option);
    reactFlow.setNodes((nds) => updateNodeMetadata(nds, nodeId, option));
    setIsOpen(false);
  };

  const filteredOptions = options.filter(
    (option) =>
      option.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      option.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const groupedOptions = filteredOptions.reduce(
    (acc, option) => {
      const { subcategory } = option;
      if (!acc[subcategory]) {
        acc[subcategory] = [];
      }
      acc[subcategory].push(option);
      return acc;
    },
    {} as Record<string, OptionData[]>,
  );

  return (
    <>
      <button
        type="button"
        className="relative w-full cursor-pointer bg-transparent py-2 text-left text-white font-extrabold tracking-widest border-transparent"
        onClick={() => setIsOpen(true)}
      >
        <span className="flex items-center">
          <span className="ml-3 block truncate min-h-[1.6rem]">{selected ? selected.name : ""}</span>
        </span>
        <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
          <ChevronUpDownIcon aria-hidden="true" className="h-6 w-6 text-white" />
        </span>
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white py-2 text-left align-middle transition-all">
                  <div className="fixed w-full bg-white px-4">
                    <div className="flex items-center">
                      <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
                      <input
                        type="text"
                        className="w-full px-2 py-2 focus:outline-none"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="max-h-[70vh] overflow-y-auto mt-12">
                    {Object.entries(groupedOptions).map(([group, options]) => (
                      <div key={group}>
                        <div className="px-5 py-2 mb-2 bg-gray-200 text-sm font-medium">{group}</div>
                        {options.map((option) => (
                          <button
                            type="button"
                            key={option.name}
                            onClick={() => onOptionSelect(option)}
                            className="group relative w-full text-left py-2 pl-3 pr-9 text-gray-600 hover:bg-gray-100 hover:text-black"
                          >
                            <div className="flex items-center">
                              <span
                                className={`ml-3 block truncate font-bold ${selected?.name === option.name ? "text-indigo-600" : ""}`}
                              >
                                {option.name}
                              </span>
                            </div>
                            <div
                              className={`ml-3 text-sm ${selected?.name === option.name ? "text-indigo-600" : "text-gray-500"}`}
                            >
                              {option.description}
                            </div>
                            <span
                              className={`absolute inset-y-0 right-0 flex items-center pr-4 ${selected?.name === option.name ? "text-indigo-600" : "hidden"}`}
                            >
                              <CheckCircleIcon aria-hidden="true" className="h-5 w-5" />
                            </span>
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
