import { initialParts } from "@/components/circuit/parts/initial-parts";
import { PartSchema, PartsCollectionSchema } from "@/components/circuit/parts/schema";
import type React from "react";
import { createContext, useContext, useState } from "react";
import type { z } from "zod";

type Part = z.infer<typeof PartSchema>;
type PartsCollection = z.infer<typeof PartsCollectionSchema>;

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
    const parsedPart = PartSchema.parse(part);
    if (parts[parsedPart.name]) {
      throw new Error(`Part with name ${parsedPart.name} already exists.`);
    }
    setParts((prevParts) => {
      const newParts = { ...prevParts, [parsedPart.name]: parsedPart };
      PartsCollectionSchema.parse(newParts);
      return newParts;
    });
  };

  const editPart = (partName: string, updatedPart: Part): void => {
    const parsedPart = PartSchema.parse(updatedPart);
    if (!parts[partName]) {
      throw new Error(`Part with name ${partName} does not exist.`);
    }
    setParts((prevParts) => {
      const newParts = { ...prevParts, [partName]: parsedPart };
      PartsCollectionSchema.parse(newParts);
      return newParts;
    });
  };

  const deletePart = (partName: string): void => {
    if (!parts[partName]) {
      throw new Error(`Part with name ${partName} does not exist.`);
    }
    setParts((prevParts) => {
      const newParts = { ...prevParts };
      delete newParts[partName];
      PartsCollectionSchema.parse(newParts);
      return newParts;
    });
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
