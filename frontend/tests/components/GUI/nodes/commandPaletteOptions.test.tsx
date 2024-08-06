import crypto from "node:crypto";
import { promoterCommandPaletteOptions } from "@/components/GUI/nodes/promoterNode";
import { proteinCommandPaletteOptions } from "@/components/GUI/nodes/proteinNode";
import { terminatorCommandPaletteOptions } from "@/components/GUI/nodes/terminatorNode";

const calculateSHA256 = (sequence: string): string => {
  return crypto.createHash("sha256").update(sequence).digest("hex");
};

const allPartsIds = [
  ...proteinCommandPaletteOptions.map((option) => option.partsId),
  ...promoterCommandPaletteOptions.map((option) => option.partsId),
  ...terminatorCommandPaletteOptions.map((option) => option.partsId),
];

describe("Command Palette Options", () => {
  describe("Protein Command Palette Options", () => {
    for (const option of proteinCommandPaletteOptions) {
      it(`should have partsId as SHA-256 hash of sequence for ${option.name}`, () => {
        const expectedHash = calculateSHA256(option.sequence);

        expect(option.partsId).toBe(expectedHash);
      });

      it(`should have controlBy partsId existing for ${option.name}`, () => {
        const controlByPartsIds = option.controlBy?.map((control) => control.partsId) || [];

        for (const partsId of controlByPartsIds) {
          const exists = allPartsIds.includes(partsId);
          expect(exists).toBe(true);
        }
      });

      it(`should have controlTo partsId existing for ${option.name}`, () => {
        const controlToPartsIds = option.controlTo?.map((control) => control.partsId) || [];

        for (const partsId of controlToPartsIds) {
          const exists = allPartsIds.includes(partsId);
          expect(exists).toBe(true);
        }
      });
    }
  });

  describe("Promoter Command Palette Options", () => {
    for (const option of promoterCommandPaletteOptions) {
      it(`should have partsId as SHA-256 hash of sequence for ${option.name}`, () => {
        const expectedHash = calculateSHA256(option.sequence);

        expect(option.partsId).toBe(expectedHash);
      });

      it(`should have controlBy partsId existing for ${option.name}`, () => {
        const controlByPartsIds = option.controlBy?.map((control) => control.partsId) || [];

        for (const partsId of controlByPartsIds) {
          const exists = allPartsIds.includes(partsId);
          expect(exists).toBe(true);
        }
      });

      it(`should have controlTo partsId existing for ${option.name}`, () => {
        const controlToPartsIds = option.controlTo?.map((control) => control.partsId) || [];

        for (const partsId of controlToPartsIds) {
          const exists = allPartsIds.includes(partsId);
          expect(exists).toBe(true);
        }
      });
    }
  });

  describe("Terminator Command Palette Options", () => {
    for (const option of terminatorCommandPaletteOptions) {
      it(`should have partsId as SHA-256 hash of sequence for ${option.name}`, () => {
        const expectedHash = calculateSHA256(option.sequence);

        expect(option.partsId).toBe(expectedHash);
      });
    }
  });
});
