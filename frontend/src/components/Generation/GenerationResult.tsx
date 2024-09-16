import { flowNodeTypes } from "@/components/GUI/CustomNode";
import type { GeneratorResponseData } from "@/interfaces/generatorAPI";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { CheckIcon, ClipboardIcon } from "@heroicons/react/24/outline";
import type React from "react";
import { useState } from "react";
import { Fragment } from "react";
import { type Edge, type Node, ReactFlow, ReactFlowProvider } from "reactflow";
import useSWR from "swr";

interface GenerationButtonsProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  reactFlowNodes: Node[];
  reactFlowEdges: Edge[];
}

interface GUIViewProps {
  reactFlowNodes: Node[];
  reactFlowEdges: Edge[];
}

const GUIView: React.FC<GUIViewProps> = ({ reactFlowNodes, reactFlowEdges }) => {
  return (
    <ReactFlowProvider>
      <ReactFlow
        nodes={reactFlowNodes}
        edges={reactFlowEdges}
        proOptions={{ hideAttribution: true }}
        nodeTypes={flowNodeTypes}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        nodesFocusable={false}
        edgesFocusable={false}
        elementsSelectable={false}
      />
    </ReactFlowProvider>
  );
};

const GeneratedSequenceView: React.FC = () => {
  const { data } = useSWR<GeneratorResponseData>("call_generator_api");
  const [copied, setCopied] = useState<string | null>(null);

  // Extract group IDs from the data
  const groupIds = Object.keys(data.parent2child_details);

  // Handle copy to clipboard action
  const handleCopy = (text: string, groupId: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(groupId);
      setTimeout(() => setCopied(null), 2000); // Reset copied state after 2 seconds
    });
  };

  return (
    <div className="container mx-auto">
      <div className="space-y-6">
        {groupIds.map((groupId) => {
          const sequences = data.parent2child_details[groupId];
          const concatenatedSequences = sequences.map((sequence) => sequence.sequence).join("");

          return (
            <div key={groupId} className="border border-gray-300 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-semibold">{groupId}</h3>
              </div>

              <div className="flex">
                <div className="bg-gray-100 p-2 overflow-x-auto flex-grow">
                  <pre className="text-sm whitespace-pre-wrap">{concatenatedSequences}</pre>
                </div>

                <div className="flex-shrink-0">
                  <div className="bg-gray-100 p-1">
                    <button
                      type="button"
                      onClick={() => handleCopy(concatenatedSequences, groupId)}
                      className="text-gray-600 hover:text-gray-700 flex items-center bg-gray-100 hover:bg-gray-200 p-2 rounded"
                    >
                      {copied === groupId ? (
                        <>
                          <CheckIcon className="h-4 w-4 text-green-500" />
                        </>
                      ) : (
                        <ClipboardIcon className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const GenerationResult: React.FC<GenerationButtonsProps> = ({
  isOpen,
  setIsOpen,
  reactFlowNodes,
  reactFlowEdges,
}) => {
  return (
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
              <DialogPanel className="w-full max-w-screen-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" className="pb-4 text-center text-lg font-medium leading-6 text-gray-900">
                  Generation Result
                </DialogTitle>

                <div className="flex space-x-6">
                  <div className="w-1/2 h-[70vh] border border-gray-300 rounded">
                    <GUIView reactFlowNodes={reactFlowNodes} reactFlowEdges={reactFlowEdges} />
                  </div>

                  <div className="flex w-1/2 flex-col justify-between">
                    <div className="">
                      <GeneratedSequenceView />
                    </div>

                    <div className="ml-auto">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={() => setIsOpen(false)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
