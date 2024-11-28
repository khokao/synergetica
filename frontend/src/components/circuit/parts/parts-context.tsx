import { initialParts } from "@/components/circuit/parts/initial-parts";
import { partSchema, partsCollectionSchema } from "@/components/circuit/parts/schema";
import type React from "react";
import { createContext, useContext, useState } from "react";
import { toast } from "sonner";
import type { z } from "zod";

type Part = z.infer<typeof partSchema>;
type PartsCollection = z.infer<typeof partsCollectionSchema>;

interface PartsContextType {
  parts: PartsCollection;
  addPart(part: Part): void;
  editPart(partName: string, updatedPart: Part): void;
  deletePart(partName: string): void;
  promoterParts: PartsCollection;
  proteinParts: PartsCollection;
  terminatorParts: PartsCollection;
}

const PartsContext = createContext<PartsContextType | undefined>(undefined);

export const PartsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [parts, setParts] = useState<PartsCollection>(initialParts);

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
      toast.success(`Part "${partName}" has been updated!`);
    } catch (error) {
      toast.error(`Error: The part "${partName}" could not be edited.`);
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
      toast.success(`Part "${partName}" has been removed.`);
    } catch (error) {
      toast.error(`Error: The part "${partName}" could not be removed.`);
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
        addPart,
        editPart,
        deletePart,
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
