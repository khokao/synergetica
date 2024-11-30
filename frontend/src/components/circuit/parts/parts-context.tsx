import { initChildNodeData } from "@/components/circuit/hooks/utils/create-node";
import { initialParts } from "@/components/circuit/parts/initial-parts";
import { partSchema, partsCollectionSchema } from "@/components/circuit/parts/schema";
import { useReactFlow } from "@xyflow/react";
import { produce } from "immer";
import type React from "react";
import { createContext, useContext, useState } from "react";
import { toast } from "sonner";
import type { z } from "zod";

type Part = z.infer<typeof partSchema>;
type PartsCollection = z.infer<typeof partsCollectionSchema>;

interface PartsContextType {
  parts: PartsCollection;
  setParts: React.Dispatch<React.SetStateAction<PartsCollection>>;
  addPart(part: Part): void;
  deletePart(partName: string): void;
  editPart(partName: string, updatedPart: Part): void;
  promoterParts: PartsCollection;
  proteinParts: PartsCollection;
  terminatorParts: PartsCollection;
}

const PartsContext = createContext<PartsContextType | undefined>(undefined);

export const PartsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { getNodes, setNodes } = useReactFlow();

  const [parts, setParts] = useState<PartsCollection>(initialParts);

  const updateNodesOnDelete = (part: Part): void => {
    const nodes = getNodes();
    const newNodes = produce(nodes, (draft) => {
      for (const node of draft) {
        if (node.data.name === part.name) {
          const category = node.data.category;
          node.data = initChildNodeData;
          node.data.category = category;
        }
      }
    });
    setNodes(newNodes);
  };

  const updateNodesOnEdit = (part: Part): void => {
    const nodes = getNodes();
    const newNodes = produce(nodes, (draft) => {
      for (const node of draft) {
        if (node.data.name === part.name) {
          node.data.name = part.name;
          node.data.description = part.description;
          node.data.category = part.category;
          node.data.sequence = part.sequence;
          node.data.controlBy = part.controlBy;
          node.data.controlTo = part.controlTo;
          node.data.meta = part.meta;
        }
      }
    });
    setNodes(newNodes);
  };

  const addPart = (part: Part): void => {
    try {
      const parsedPart = partSchema.parse(part);
      if (parts[parsedPart.name]) {
        throw new Error(`Part with name ${parsedPart.name} already exists.`);
      }
      setParts((prevParts) => {
        const newParts = { ...prevParts, [parsedPart.name]: parsedPart };
        partsCollectionSchema.parse(newParts);
        return newParts;
      });
      toast.success(`New part "${parsedPart.name}" has been created!`);
    } catch (error) {
      toast.error(`Error: The part "${part.name}" could not be added.`);
      throw error;
    }
  };

  const deletePart = (partName: string): void => {
    try {
      if (!parts[partName]) {
        throw new Error(`Part with name ${partName} does not exist.`);
      }
      setParts((prevParts) => {
        const newParts = { ...prevParts };
        delete newParts[partName];
        partsCollectionSchema.parse(newParts);
        return newParts;
      });
      updateNodesOnDelete(parts[partName]);
      toast.success(`Part "${partName}" has been removed.`);
    } catch (error) {
      toast.error(`Error: The part "${partName}" could not be removed.`);
      throw error;
    }
  };

  const editPart = (partName: string, updatedPart: Part): void => {
    try {
      const parsedPart = partSchema.parse(updatedPart);
      if (!parts[partName]) {
        throw new Error(`Part with name ${partName} does not exist.`);
      }
      setParts((prevParts) => {
        const newParts = { ...prevParts, [partName]: parsedPart };
        partsCollectionSchema.parse(newParts);
        return newParts;
      });
      updateNodesOnEdit(parsedPart);
      toast.success(`Part "${partName}" has been updated!`);
    } catch (error) {
      toast.error(`Error: The part "${partName}" could not be edited.`);
      throw error;
    }
  };

  const promoterParts = Object.fromEntries(Object.entries(parts).filter(([_, part]) => part.category === "promoter"));

  const proteinParts = Object.fromEntries(Object.entries(parts).filter(([_, part]) => part.category === "protein"));

  const terminatorParts = Object.fromEntries(
    Object.entries(parts).filter(([_, part]) => part.category === "terminator"),
  );

  return (
    <PartsContext.Provider
      value={{
        parts,
        setParts,
        addPart,
        deletePart,
        editPart,
        promoterParts,
        proteinParts,
        terminatorParts,
      }}
    >
      {children}
    </PartsContext.Provider>
  );
};

export const useParts = (): PartsContextType => {
  const context = useContext(PartsContext);
  if (context === undefined) {
    throw new Error("useParts must be used within a PartsProvider");
  }
  return context;
};
