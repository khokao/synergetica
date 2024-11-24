import { PartSchema } from "@/components/circuit/parts/schema";

import PameRData from "@/components/circuit/parts/promoter/PameR.json";
import PamtRData from "@/components/circuit/parts/promoter/PamtR.json";
import PbetlData from "@/components/circuit/parts/promoter/Pbetl.json";
import Pbm3r1Data from "@/components/circuit/parts/promoter/Pbm3r1.json";
import PhyllRData from "@/components/circuit/parts/promoter/PhyllR.json";
import PlcaRAData from "@/components/circuit/parts/promoter/PlcaRA.json";
import PlitRData from "@/components/circuit/parts/promoter/PlitR.json";
import PlmrAData from "@/components/circuit/parts/promoter/PlmrA.json";
import PphlFData from "@/components/circuit/parts/promoter/PphlF.json";
import PpsrAData from "@/components/circuit/parts/promoter/PpsrA.json";
import PqacRData from "@/components/circuit/parts/promoter/PqacR.json";
import PsrpRData from "@/components/circuit/parts/promoter/PsrpR.json";

import AmeRData from "@/components/circuit/parts/protein/AmeR.json";
import AmtRData from "@/components/circuit/parts/protein/AmtR.json";
import BM3R1Data from "@/components/circuit/parts/protein/BM3R1.json";
import BetIData from "@/components/circuit/parts/protein/BetI.json";
import HlyIIRData from "@/components/circuit/parts/protein/HlyIIR.json";
import IcaRAData from "@/components/circuit/parts/protein/IcaRA.json";
import LitRData from "@/components/circuit/parts/protein/LitR.json";
import LmrAData from "@/components/circuit/parts/protein/LmrA.json";
import PhlFData from "@/components/circuit/parts/protein/PhlF.json";
import PsrAData from "@/components/circuit/parts/protein/PsrA.json";
import QacRData from "@/components/circuit/parts/protein/QacR.json";
import SrpRData from "@/components/circuit/parts/protein/SrpR.json";

import L3S3P31Data from "@/components/circuit/parts/terminator/L3S3P31.json";

const PameR = PartSchema.parse(PameRData);
const PamtR = PartSchema.parse(PamtRData);
const Pbetl = PartSchema.parse(PbetlData);
const Pbm3r1 = PartSchema.parse(Pbm3r1Data);
const PhyllR = PartSchema.parse(PhyllRData);
const PlcaRA = PartSchema.parse(PlcaRAData);
const PlitR = PartSchema.parse(PlitRData);
const PlmrA = PartSchema.parse(PlmrAData);
const PphlF = PartSchema.parse(PphlFData);
const PpsrA = PartSchema.parse(PpsrAData);
const PqacR = PartSchema.parse(PqacRData);
const PsrpR = PartSchema.parse(PsrpRData);

const AmeR = PartSchema.parse(AmeRData);
const AmtR = PartSchema.parse(AmtRData);
const BM3R1 = PartSchema.parse(BM3R1Data);
const BetI = PartSchema.parse(BetIData);
const HlyIIR = PartSchema.parse(HlyIIRData);
const IcaRA = PartSchema.parse(IcaRAData);
const LitR = PartSchema.parse(LitRData);
const LmrA = PartSchema.parse(LmrAData);
const PhlF = PartSchema.parse(PhlFData);
const PsrA = PartSchema.parse(PsrAData);
const QacR = PartSchema.parse(QacRData);
const SrpR = PartSchema.parse(SrpRData);

const L3S3P31 = PartSchema.parse(L3S3P31Data);

export const PROMOTER_PARTS = {
  PameR,
  PamtR,
  Pbetl,
  Pbm3r1,
  PhyllR,
  PlcaRA,
  PlitR,
  PlmrA,
  PphlF,
  PpsrA,
  PqacR,
  PsrpR,
};

export const PROTEIN_PARTS = {
  AmeR,
  AmtR,
  BetI,
  BM3R1,
  HlyIIR,
  IcaRA,
  LitR,
  LmrA,
  PhlF,
  PsrA,
  QacR,
  SrpR,
};

export const TERMINATOR_PARTS = {
  L3S3P31,
};

export const ALL_PARTS = {
  ...PROMOTER_PARTS,
  ...PROTEIN_PARTS,
  ...TERMINATOR_PARTS,
};
