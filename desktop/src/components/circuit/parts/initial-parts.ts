import { partsCollectionSchema } from "@/components/circuit/parts/schema";

import PameRData from "@/components/circuit/parts/promoter/PameR.json";
import PamtRData from "@/components/circuit/parts/promoter/PamtR.json";
import PbetIData from "@/components/circuit/parts/promoter/PbetI.json";
import Pbm3r1Data from "@/components/circuit/parts/promoter/Pbm3r1.json";
import PhyllRData from "@/components/circuit/parts/promoter/PhyllR.json";
import PlcaRAData from "@/components/circuit/parts/promoter/PlcaRA.json";
import PlitRData from "@/components/circuit/parts/promoter/PlitR.json";
import PlmrAData from "@/components/circuit/parts/promoter/PlmrA.json";
import PphlFAMData from "@/components/circuit/parts/promoter/PphlFAM.json";
import PpsrAData from "@/components/circuit/parts/promoter/PpsrA.json";
import PqacRData from "@/components/circuit/parts/promoter/PqacR.json";
import PsrpRData from "@/components/circuit/parts/promoter/PsrpR.json";
import PBADData from "@/components/circuit/parts/promoter/PBAD.json";
import PJR1Data from "@/components/circuit/parts/promoter/PJR1.json";
import PJR2Data from "@/components/circuit/parts/promoter/PJR2.json";
import PJR3Data from "@/components/circuit/parts/promoter/PJR3.json";
import PJR4Data from "@/components/circuit/parts/promoter/PJR4.json";
import PJR6Data from "@/components/circuit/parts/promoter/PJR6.json";
import PJR7Data from "@/components/circuit/parts/promoter/PJR7.json";
import PJR8Data from "@/components/circuit/parts/promoter/PJR8.json";
import PJR9Data from "@/components/circuit/parts/promoter/PJR9.json";
import PJR11Data from "@/components/circuit/parts/promoter/PJR11.json";
import PcymRCData from "@/components/circuit/parts/promoter/PcymRC.json";
import PluxBData from "@/components/circuit/parts/promoter/PluxB.json";
import PvanCCData from "@/components/circuit/parts/promoter/PvanCC.json";
import PtacData from "@/components/circuit/parts/promoter/Ptac.json";
import PtetData from "@/components/circuit/parts/promoter/Ptet.json";
import PttgData from "@/components/circuit/parts/promoter/Pttg.json";
import P3B5BData from "@/components/circuit/parts/promoter/P3B5B.json";
import PsalTTCData from "@/components/circuit/parts/promoter/PsalTTC.json";
import PcinData from "@/components/circuit/parts/promoter/Pcin.json";
import PacuData from "@/components/circuit/parts/promoter/Pacu.json";

import AmeRData from "@/components/circuit/parts/protein/AmeR.json";
import AmtRData from "@/components/circuit/parts/protein/AmtR.json";
import BM3R1Data from "@/components/circuit/parts/protein/BM3R1.json";
import BetIData from "@/components/circuit/parts/protein/BetI.json";
import HlyIIRData from "@/components/circuit/parts/protein/HlyIIR.json";
import LcaRAData from "@/components/circuit/parts/protein/LcaRA.json";
import LitRData from "@/components/circuit/parts/protein/LitR.json";
import LmrAData from "@/components/circuit/parts/protein/LmrA.json";
import PhlFAMData from "@/components/circuit/parts/protein/PhlFAM.json";
import PsrAData from "@/components/circuit/parts/protein/PsrA.json";
import QacRData from "@/components/circuit/parts/protein/QacR.json";
import SrpRData from "@/components/circuit/parts/protein/SrpR.json";
import AraCAMData from "@/components/circuit/parts/protein/AraC_AM.json";
import JR1Data from "@/components/circuit/parts/protein/JR1.json";
import JR2Data from "@/components/circuit/parts/protein/JR2.json";
import JR3Data from "@/components/circuit/parts/protein/JR3.json";
import JR4Data from "@/components/circuit/parts/protein/JR4.json";
import JR6Data from "@/components/circuit/parts/protein/JR6.json";
import JR7Data from "@/components/circuit/parts/protein/JR7.json";
import JR8Data from "@/components/circuit/parts/protein/JR8.json";
import JR9Data from "@/components/circuit/parts/protein/JR9.json";
import JR11Data from "@/components/circuit/parts/protein/JR11.json";
import CymRAMData from "@/components/circuit/parts/protein/CymR_AM.json";
import LuxRData from "@/components/circuit/parts/protein/LuxR.json";
import VanRAMData from "@/components/circuit/parts/protein/VanR_AM.json";
import LacIAMData from "@/components/circuit/parts/protein/LacIAM.json";
import TetRData from "@/components/circuit/parts/protein/TetR.json";
import TtgRAMData from "@/components/circuit/parts/protein/TtgRAM.json";
import PcaUAMData from "@/components/circuit/parts/protein/PcaUAM.json";
import NahRAMData from "@/components/circuit/parts/protein/NahRAM.json";
import CinRAMData from "@/components/circuit/parts/protein/CinRAM.json";
import AcuRAMData from "@/components/circuit/parts/protein/AcuRAM.json";

import L3S3P31Data from "@/components/circuit/parts/terminator/L3S3P31.json";
import L3S3P11Data from "@/components/circuit/parts/terminator/L3S3P11.json";
import L3S2P55Data from "@/components/circuit/parts/terminator/L3S2P55.json";
import L3S2P24Data from "@/components/circuit/parts/terminator/L3S2P24.json";
import L3S2P21Data from "@/components/circuit/parts/terminator/L3S2P21.json";
import L3S2P11Data from "@/components/circuit/parts/terminator/L3S2P11.json";
import ECK120010818Data from "@/components/circuit/parts/terminator/ECK120010818.json";
import ECK120010876Data from "@/components/circuit/parts/terminator/ECK120010876.json";
import ECK120015170Data from "@/components/circuit/parts/terminator/ECK120015170.json";
import ECK120015440Data from "@/components/circuit/parts/terminator/ECK120015440.json";
import ECK120033736Data from "@/components/circuit/parts/terminator/ECK120033736.json";
import ECK120033737Data from "@/components/circuit/parts/terminator/ECK120033737.json";

export const initialParts = partsCollectionSchema.parse({
  PameR: PameRData,
  PamtR: PamtRData,
  PbetI: PbetIData,
  Pbm3r1: Pbm3r1Data,
  PhyllR: PhyllRData,
  PlcaRA: PlcaRAData,
  PlitR: PlitRData,
  PlmrA: PlmrAData,
  PphlFAM: PphlFAMData,
  PpsrA: PpsrAData,
  PqacR: PqacRData,
  PsrpR: PsrpRData,
  PBAD: PBADData,
  PcymRC: PcymRCData,
  PluxB: PluxBData,
  PvanCC: PvanCCData,
  Ptac: PtacData,
  Ptet: PtetData,
  Pttg: PttgData,
  P3B5B: P3B5BData,
  PsalTTC: PsalTTCData,
  Pcin: PcinData,
  Pacu: PacuData,
  PJR1: PJR1Data,
  PJR2: PJR2Data,
  PJR3: PJR3Data,
  PJR4: PJR4Data,
  PJR6: PJR6Data,
  PJR7: PJR7Data,
  PJR8: PJR8Data,
  PJR9: PJR9Data,
  PJR11: PJR11Data,

  AmeR: AmeRData,
  AmtR: AmtRData,
  BM3R1: BM3R1Data,
  BetI: BetIData,
  HlyIIR: HlyIIRData,
  LcaRA: LcaRAData,
  LitR: LitRData,
  LmrA: LmrAData,
  PhlFAM: PhlFAMData,
  PsrA: PsrAData,
  QacR: QacRData,
  SrpR: SrpRData,
  AraCAM: AraCAMData,
  CymRAM: CymRAMData,
  LuxR: LuxRData,
  VanRAM: VanRAMData,
  LacIAM: LacIAMData,
  TetR: TetRData,
  TtgRAM: TtgRAMData,
  PcaUAM: PcaUAMData,
  NahRAM: NahRAMData,
  CinRAM: CinRAMData,
  AcuRAM: AcuRAMData,
  JR1: JR1Data,
  JR2: JR2Data,
  JR3: JR3Data,
  JR4: JR4Data,
  JR6: JR6Data,
  JR7: JR7Data,
  JR8: JR8Data,
  JR9: JR9Data,
  JR11: JR11Data,

  L3S3P31: L3S3P31Data,
  L3S3P11: L3S3P11Data,
  L3S2P55: L3S2P55Data,
  L3S2P11: L3S2P11Data,
  L3S2P21: L3S2P21Data,
  L3S2P24: L3S2P24Data,
  ECK120010818: ECK120010818Data,
  ECK120010876: ECK120010876Data,
  ECK120015170: ECK120015170Data,
  ECK120015440: ECK120015440Data,
  ECK120033736: ECK120033736Data,
  ECK120033737: ECK120033737Data,
});
