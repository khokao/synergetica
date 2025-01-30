import { initChildNodeData } from "@/components/circuit/hooks/utils/create-node";
import { initialParts } from "@/components/circuit/parts/initial-parts";
import { partSchema, partsCollectionSchema } from "@/components/circuit/parts/schema";
import { useReactFlow } from "@xyflow/react";
import { produce } from "immer";
import type React from "react";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import type { z } from "zod";

type Part = z.infer<typeof partSchema>;
type PartsCollection = z.infer<typeof partsCollectionSchema>;

class InteractionStore {
  private proteinToPromotersMap: Record<string, Array<{ from: string; to: string; type: string }>> = {};
  private promoterToProteinsMap: Record<string, Array<{ from: string; to: string; type: string }>> = {};

  addInteraction(from: string, to: string, type: string) {
    if (!this.proteinToPromotersMap[from]) {
      this.proteinToPromotersMap[from] = [];
    }
    this.proteinToPromotersMap[from].push({ from, to, type });

    if (!this.promoterToProteinsMap[to]) {
      this.promoterToProteinsMap[to] = [];
    }
    this.promoterToProteinsMap[to].push({ from, to, type });
  }

  clear() {
    this.proteinToPromotersMap = {};
    this.promoterToProteinsMap = {};
  }

  getPromotersByProtein(from: string) {
    return this.proteinToPromotersMap[from] || [];
  }

  getProteinsByPromoter(to: string) {
    return this.promoterToProteinsMap[to] || [];
  }
}

interface PartsContextType {
  parts: PartsCollection;
  setParts: React.Dispatch<React.SetStateAction<PartsCollection>>;
  addPart(part: Part): void;
  deletePart(partName: string): void;
  editPart(partName: string, updatedPart: Part): void;

  promoterParts: PartsCollection;
  proteinParts: PartsCollection;
  terminatorParts: PartsCollection;

  interactionStore: InteractionStore;
}

const PartsContext = createContext<PartsContextType | undefined>(undefined);

export const PartsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { getNodes, setNodes } = useReactFlow();

  const [parts, setParts] = useState<PartsCollection>(initialParts);

  const [interactionStore] = useState<InteractionStore>(() => new InteractionStore());

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
          node.data.params = part.params;
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

  const promoterParts = Object.fromEntries(Object.entries(parts).filter(([_, part]) => part.category === "Promoter"));
  const proteinParts = Object.fromEntries(Object.entries(parts).filter(([_, part]) => part.category === "Protein"));
  const terminatorParts = Object.fromEntries(
    Object.entries(parts).filter(([_, part]) => part.category === "Terminator"),
  );

  const refreshInteractions = useCallback(() => {
    interactionStore.clear();
    for (const [name, part] of Object.entries(parts)) {
      if (part.category === "Promoter" && part.controlBy && Array.isArray(part.controlBy)) {
        for (const ctrl of part.controlBy) {
          interactionStore.addInteraction(ctrl.name, name, ctrl.type);
        }
      }
    }
  }, [parts, interactionStore]);

  useEffect(() => {
    refreshInteractions();
  }, [refreshInteractions]);

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
        interactionStore,
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
