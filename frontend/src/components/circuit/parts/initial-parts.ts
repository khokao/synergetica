import { PartSchema, PartsCollectionSchema } from "@/components/circuit/parts/schema";

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

export const initialParts = PartsCollectionSchema.parse({
  PameR: PartSchema.parse(PameRData),
  PamtR: PartSchema.parse(PamtRData),
  Pbetl: PartSchema.parse(PbetlData),
  Pbm3r1: PartSchema.parse(Pbm3r1Data),
  PhyllR: PartSchema.parse(PhyllRData),
  PlcaRA: PartSchema.parse(PlcaRAData),
  PlitR: PartSchema.parse(PlitRData),
  PlmrA: PartSchema.parse(PlmrAData),
  PphlF: PartSchema.parse(PphlFData),
  PpsrA: PartSchema.parse(PpsrAData),
  PqacR: PartSchema.parse(PqacRData),
  PsrpR: PartSchema.parse(PsrpRData),

  AmeR: PartSchema.parse(AmeRData),
  AmtR: PartSchema.parse(AmtRData),
  BM3R1: PartSchema.parse(BM3R1Data),
  BetI: PartSchema.parse(BetIData),
  HlyIIR: PartSchema.parse(HlyIIRData),
  IcaRA: PartSchema.parse(IcaRAData),
  LitR: PartSchema.parse(LitRData),
  LmrA: PartSchema.parse(LmrAData),
  PhlF: PartSchema.parse(PhlFData),
  PsrA: PartSchema.parse(PsrAData),
  QacR: PartSchema.parse(QacRData),
  SrpR: PartSchema.parse(SrpRData),

  L3S3P31: PartSchema.parse(L3S3P31Data),
});
