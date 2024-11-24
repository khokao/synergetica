import { PartSchema } from "@/components/circuit/parts/schema";

import PameRData from "@/components/circuit/parts/promoter/PameR.json";
import Pbm3r1Data from "@/components/circuit/parts/promoter/Pbm3r1.json";

import AmeRData from "@/components/circuit/parts/protein/AmeR.json";
import BM3R1Data from "@/components/circuit/parts/protein/BM3R1.json";

import L3S3P31Data from "@/components/circuit/parts/terminator/L3S3P31.json";

const PameR = PartSchema.parse(PameRData);
const Pbm3r1 = PartSchema.parse(Pbm3r1Data);

const AmeR = PartSchema.parse(AmeRData);
const BM3R1 = PartSchema.parse(BM3R1Data);

const L3S3P31 = PartSchema.parse(L3S3P31Data);

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
