import PameR from "@/components/circuit/parts/promoter/PameR.json";
import Pbm3r1 from "@/components/circuit/parts/promoter/Pbm3r1.json";
import AmeR from "@/components/circuit/parts/protein/AmeR.json";
import BM3R1 from "@/components/circuit/parts/protein/BM3R1.json";
import L3S3P31 from "@/components/circuit/parts/terminator/L3S3P31.json";

export const PROMOTER_PARTS = {
  PameR,
  Pbm3r1,
};

export const PROTEIN_PARTS = {
  AmeR,
  BM3R1,
};

export const TERMINATOR_PARTS = {
  L3S3P31,
};

export const ALL_PARTS = {
  ...PROMOTER_PARTS,
  ...PROTEIN_PARTS,
  ...TERMINATOR_PARTS,
};
