import { partsCollectionSchema } from "@/components/circuit/parts/schema";

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

export const initialParts = partsCollectionSchema.parse({
  PameR: PameRData,
  PamtR: PamtRData,
  Pbetl: PbetlData,
  Pbm3r1: Pbm3r1Data,
  PhyllR: PhyllRData,
  PlcaRA: PlcaRAData,
  PlitR: PlitRData,
  PlmrA: PlmrAData,
  PphlF: PphlFData,
  PpsrA: PpsrAData,
  PqacR: PqacRData,
  PsrpR: PsrpRData,

  AmeR: AmeRData,
  AmtR: AmtRData,
  BM3R1: BM3R1Data,
  BetI: BetIData,
  HlyIIR: HlyIIRData,
  IcaRA: IcaRAData,
  LitR: LitRData,
  LmrA: LmrAData,
  PhlF: PhlFData,
  PsrA: PsrAData,
  QacR: QacRData,
  SrpR: SrpRData,

  L3S3P31: L3S3P31Data,
});
