import { onDragStart } from "@/components/GUI/Bottombar";
import icon from "@public/images/node-protein.svg";
import Image from "next/image";
import React from "react";

const iconUrl = "/images/node-protein.svg";
const nodeCategory = "protein";
const leftHandleStyle = { top: 15, left: 6 };
const rightHandleStyle = { top: 15, left: 178 };
const commandPaletteButtonStyle = { top: -6, left: 12, right: 30 };

export const proteinCommandPaletteOptions = [
  {
    name: "AmeR",
    description: "Repressor Protein of PameR",
    subcategory: "RepressorProtein",
    sequence:
      "atgaacaaaaccattgatcaggtgcgtaaaggtgatcgtaaaagcgatctgccggttcgtcgtcgtccgcgtcgtagtgccgaagaaacccgtcgtgatattctggcaaaagccgaagaactgtttcgtgaacgtggttttaatgcagttgccattgcagatattgcaagcgcactgaatatgagtccggcaaatgtgtttaaacattttagcagcaaaaacgcactggttgatgcaattggttttggtcagattggtgtttttgaacgtcagatttgtccgctggataaaagccatgcaccgctggatcgtctgcgtcatctggcacgtaatctgatggaacagcatcatcaggatcatttcaaacacatacgggtttttattcagatcctgatgaccgccaaacaggatatgaaatgtggcgattattacaaaagcgtgattgcaaaactgctggccgaaattattcgtgatggtgttgaagcaggtctgtatattgcaaccgatattccggttctggcagaaaccgttctgcatgcactgaccagcgttattcatccggttctgattgcacaagaagatattggtaatctggcaacccgttgtgatcagctggttgatctgattgatgcaggtctgcgtaatccgctggcaaaataa",
    controlBy: null,
    controlTo: {
      PameR: {
        controlType: "Repression",
      },
    },
    meta: null,
  },
  {
    name: "AmtR",
    description: "Repressor Protein of PamtR",
    subcategory: "RepressorProtein",
    sequence:
      "atggcaggcgcagttggtcgtccgcgtcgtagtgcaccgcgtcgtgcaggtaaaaatccgcgtgaagaaattctggatgcaagcgcagaactgtttacccgtcagggttttgcaaccaccagtacccatcagattgcagatgcagttggtattcgtcaggcaagcctgtattatcattttccgagcaaaaccgaaatctttctgaccctgctgaaaagcaccgttgaaccgagcaccgttctggcagaagatctgagcaccctggatgcaggtccggaaatgcgtctgtgggcaattgttgcaagcgaagttcgtctgctgctgagcaccaaatggaatgttggtcgtctgtatcagctgccgattgttggtagcgaagaatttgcagaatatcatagccagcgtgaagcactgaccaatgtttttcgtgatctggcaaccgaaattgttggtgatgatccgcgtgcagaactgccgtttcatattaccatgagcgttattgaaatgcgtcgcaatgatggtaaaattccgagtccgctgagcgcagatagcctgccggaaaccgcaattatgctggcagatgcaagcctggcagttctgggtgcaccgctgcctgcagatcgtgttgaaaaaaccctggaactgattaaacaggcagatgcaaaataa",
    controlBy: null,
    controlTo: {
      PamtR: {
        controlType: "Repression",
      },
    },
    meta: null,
  },
  {
    name: "BetI",
    description: "Repressor Protein of Betl",
    subcategory: "RepressorProtein",
    sequence:
      "atgccgaaactgggtatgcagagcattcgtcgtcgtcagctgattgatgcaaccctggaagcaattaatgaagttggtatgcatgatgcaaccattgcacagattgcacgtcgtgccggtgttagcaccggtattattagccattatttccgcgataaaaacggtctgctggaagcaaccatgcgtgatattaccagccagctgcgtgatgcagttctgaatcgtctgcatgcactgccgcagggtagcgcagaacagcgtctgcaggcaattgttggtggtaattttgatgaaacccaggttagcagcgcagcaatgaaagcatggctggcattttgggcaagcagcatgcatcagccgatgctgtatcgtctgcagcaggttagcagtcgtcgtctgctgagcaatctggttagcgaatttcgtcgtgaactgcctcgtgaacaggcacaagaggcaggttatggtctggcagcactgattgatggtctgtggctgcgtgcagcactgagcggtaaaccgctggataaaacccgtgcaaatagcctgacccgtcattttatcacccagcatctgccgaccgattaa",
    controlBy: null,
    controlTo: {
      Pbetl: {
        controlType: "Repression",
      },
    },
    meta: null,
  },
  {
    name: "BM3R1",
    description: "Repressor Protein of Pbm3R1",
    subcategory: "RepressorProtein",
    sequence:
      "atggaaagcaccccgaccaaacagaaagcaatttttagcgcaagcctgctgctgtttgcagaacgtggttttgatgcaaccaccatgccgatgattgcagaaaatgcaaaagttggtgcaggcaccatttatcgctatttcaaaaacaaagaaagcctggtgaacgaactgtttcagcagcatgttaatgaatttctgcagtgtattgaaagcggtctggcaaatgaacgtgatggttatcgtgatggctttcatcacatttttgaaggtatggtgacctttaccaaaaatcatccgcgtgcactgggttttatcaaaacccatagccagggcacctttctgaccgaagaaagccgtctggcatatcagaaactggttgaatttgtgtgcaccttttttcgtgaaggtcagaaacagggtgtgattcgtaatctgccggaaaatgcactgattgcaattctgtttggcagctttatggaagtgtatgaaatgatcgagaacgattatctgagcctgaccgatgaactgctgaccggtgttgaagaaagcctgtgggcagcactgagccgtcagagctaa",
    controlBy: null,
    controlTo: {
      Pbm3r1: {
        controlType: "Repression",
      },
    },
    meta: null,
  },
  {
    name: "HlyIIR",
    description: "Repressor Protein of PhyllR",
    subcategory: "RepressorProtein",
    sequence:
      "atgaaatacatcctgtttgaggtgtgcgaaatgggtaaaagccgtgaacagaccatggaaaatattctgaaagcagccaaaaagaaattcggcgaacgtggttatgaaggcaccagcattcaagaaattaccaaagaagccaaagttaacgttgcaatggccagctattactttaatggcaaagagaacctgtactacgaggtgttcaaaaaatacggtctggcaaatgaactgccgaactttctggaaaaaaaccagtttaatccgattaatgccctgcgtgaatatctgaccgtttttaccacccacattaaagaaaatccggaaattggcaccctggcctatgaagaaattatcaaagaaagcgcacgcctggaaaaaatcaaaccgtattttatcggcagcttcgaacagctgaaagaaattctgcaagagggtgaaaaacagggtgtgtttcacttttttagcatcaaccataccatccattggattaccagcattgttctgtttccgaaattcaaaaaattcatcgatagcctgggtccgaatgaaaccaatgataccaatcatgaatggatgccggaagatctggttagccgtattattagcgcactgaccgataaaccgaacatttaa",
    controlBy: null,
    controlTo: {
      PhyllR: {
        controlType: "Repression",
      },
    },
    meta: null,
  },
  {
    name: "IcaRA",
    description: "Repressor Protein of PlcaRA",
    subcategory: "RepressorProtein",
    sequence:
      "gtgaaagacaaaattatcgataacgccatcaccctgtttagcgaaaaaggttatgacggcaccaccctggatgatattgcaaaaagcgtgaacatcaaaaaagccagcctgtattatcactttgatagcaaaaaaagcatctacgagcagagcgttaaatgctgtttcgattatctgaacaacatcatcatgatgaaccagaacaaaagcaactatagcatcgatgccctgtatcagtttctgtttgagttcatcttcgatatcgaggaacgctatattcgtatgtatgttcagctgagcaacacaccggaagaattttcaggtaacatttatggccagatccaggatctgaatcagagcctgagcaaagaaatcgccaaattctatgacgaaagcaaaatcaaaatgaccaaagaggacttccagaatctgattctgctgtttctggaaagctggtatctgaaagccagctttagccagaaatttggtgcagttgaagaaagcaaaagccagtttaaagatgaggtttatagcctgctgaacatctttctgaagaaataa",
    controlBy: null,
    controlTo: {
      PlcaRA: {
        controlType: "Repression",
      },
    },
    meta: null,
  },
  {
    name: "LitR",
    description: "Repressor Protein of PlitR",
    subcategory: "RepressorProtein",
    sequence:
      "atggataccattcagaaacgtccgcgtacccgtctgagtccggaaaaacgtaaagaacagctgctggatattgccattgaagtttttagccagcgtggtattggtcgtggtggtcatgcagatattgcagaaattgcacaggttagcgttgcaaccgtgtttaactattttccgacccgtgaagatctggttgatgatgttctgaacaaagtggaaaacgagtttcaccagttcatcaataacagcattagcctggatctggatgttcgtagcaatctgaataccctgctgctgaacattattgatagcgttcagaccggcaacaaatggattaaagtttggtttgaatggtcaaccagcacccgtgatgaagtttggcctctgtttctgagcacccatagcaataccaatcaggtgatcaaaaccatgtttgaagagggtattgaacgcaatgaagtgtgcaatgatcatacaccggaaaatctgaccaaaatgctgcatggtatttgctatagcgtgtttattcaggccaatcgtaatagcagcagcgaagaaatggaagaaaccgcaaattgctttctgaatatgctgtgcatctacaaataa",
    controlBy: null,
    controlTo: {
      PlitR: {
        controlType: "Repression",
      },
    },
    meta: null,
  },
  {
    name: "LmrA",
    description: "Repressor Protein of PlmrA",
    subcategory: "RepressorProtein",
    sequence:
      "atgagctatggtgatagccgtgaaaaaattctgagcgcagcaacccgtctgtttcagctgcagggttattatggcaccggtctgaatcagattatcaaagaaagcggtgcaccgaaaggtagcctgtattatcattttccgggtggtaaagaacagctggcaattgaagcagtgaacgaaatgaaagaatatatccgccagaaaatcgccgattgtatggaagcatgtaccgatccggcagaaggtattcaggcatttctgaaagaactgagctgtcagtttagctgtaccgaagatattgaaggtctgccggttggtctgctggcagcagaaaccagcctgaaaagcgaaccgctgcgtgaagcatgtcatgaagcatataaagaatgggccagcgtgtatgaagaaaaactgcgtcagaccggttgtagcgaaagccgtgcaaaagaagcaagcaccgttgttaatgcaatgattgaaggtggtattctgctgagcctgaccgcaaaaaatagcacaccgctgctgcatattagcagctgtattccggatctgctgaaacgttaa",
    controlBy: null,
    controlTo: {
      PlmrA: {
        controlType: "Repression",
      },
    },
    meta: null,
  },
  {
    name: "PhlF",
    description: "Repressor Protein of PphlF",
    subcategory: "RepressorProtein",
    sequence:
      "atggcacgtaccccgagccgtagcagcattggtagcctgcgtagtccgcatacccataaagcaattctgaccagcaccattgaaatcctgaaagaatgtggttatagcggtctgagcattgaaagcgttgcacgtcgtgccggtgcaagcaaaccgaccatttatcgttggtggaccaataaagcagcactgattgccgaagtgtatgaaaatgaaagcgaacaggtgcgtaaatttccggatctgggtagctttaaagccgatctggattttctgctgcgtaatctgtggaaagtttggcgtgaaaccatttgtggtgaagcatttcgttgtgttattgcagaagcacagctggaccctgcaaccctgacccagctgaaagatcagtttatggaacgtcgtcgtgagatgccgaaaaaactggttgaaaatgccattagcaatggtgaactgccgaaagataccaatcgtgaactgctgctggatatgatttttggtttttgttggtatcgcctgctgaccgaacagctgaccgttgaacaggatattgaagaatttaccttcctgctgattaatggtgtttgtccgggtacacagcgttaa",
    controlBy: null,
    controlTo: {
      PphlF: {
        controlType: "Repression",
      },
    },
    meta: null,
  },
  {
    name: "PsrA",
    description: "Repressor Protein of PpsrA",
    subcategory: "RepressorProtein",
    sequence:
      "atggcacagagcgaaaccgttgaacgtattctggatgcagcagaacagctgtttgcagaacgtggttttgcagaaaccagcctgcgtctgattaccagcaaagccggtgttaatctggcagcagtgaattatcattttggcagcaaaaaagcactgattcaggcagtttttagccgttttctgggtccgttttgtgcaagcctggaacgtgaactggaacgtcgtcaggcacgtccggaacagaaaccgagcctggaagaactgctggaaatgctggttgaacaggcactggcagttcagcctcgtagcaataatgatctgagcatttttatgcgtctgctgggtctggcatttagccagagccagggtcatctgcgtcgttatctggaagatatgtatggtaaagtgttccgtcgttatatgctgctggttaatgaagcagcaccgcgtgttccgcctctggaactgttttggcgtgttcattttatgctgggtgcagcagcatttagcatgagcggtattaaagcactgcgtgcaattgcagaaaccgattttggtattaacaccagcattgaacaggttatgcgtctgatggttccgtttctggcagcaggtatgcgtgcagatagcggtgttaccgatgaagcaatggcagcagcacagctgcgtccgcgtagcaaaaccagcaccagcgcaaccaccgcaaaagcataa",
    controlBy: null,
    controlTo: {
      PpsrA: {
        controlType: "Repression",
      },
    },
    meta: null,
  },
  {
    name: "QacR",
    description: "Repressor Protein of PqacR",
    subcategory: "RepressorProtein",
    sequence:
      "atgaacctgaaagataaaattctgggcgttgccaaagaactgtttatcaaaaatggctataacgcaaccaccaccggtgaaattgttaaactgagcgaaagcagcaaaggcaatctgtattatcactttaaaaccaaagagaacctgtttctggaaatcctgaacatcgaagaaagcaaatggcaagagcagtggaaaaaagaacaaatcaaatgcaaaaccaaccgcgagaaattctatctgtataatgaactgagcctgaccaccgaatattactatccgctgcagaatgccatcatcgagttttataccgagtactataaaaccaacagcatcaacgagaaaatgaacaaactggaaaacaaatacatcgatgcctaccacgtgatctttaaagaaggtaatctgaacggcgaatggtgcattaatgatgttaatgccgtgagcaaaattgcagcaaatgccgttaatggcattgttacctttacccatgagcagaatatcaacgaacgcattaaactgatgaacaaattcagccagatctttctgaatggcctgagcaaataa",
    controlBy: null,
    controlTo: {
      PqacR: {
        controlType: "Repression",
      },
    },
    meta: null,
  },
  {
    name: "SrpR",
    description: "Repressor Protein of PsrpR",
    subcategory: "RepressorProtein",
    sequence:
      "atggcacgtaaaaccgcagcagaagcagaagaaacccgtcagcgtattattgatgcagcactggaagtttttgttgcacagggtgttagtgatgcaaccctggatcagattgcacgtaaagccggtgttacccgtggtgcagtttattggcattttaatggtaaactggaagttctgcaggcagttctggcaagccgtcagcatccgctggaactggattttacaccggatctgggtattgaacgtagctgggaagcagttgttgttgcaatgctggatgcagttcatagtccgcagagcaaacagtttagcgaaattctgatttatcagggtctggatgaaagcggtctgattcataatcgtatggttcaggcaagcgatcgttttctgcagtatattcatcaggttctgcgtcatgcagttacccagggtgaactgccgattaatctggatctgcagaccagcattggtgtttttaaaggtctgattaccggtctgctgtatgaaggtctgcgtagcaaagatcagcaggcacagattatcaaagttgcactgggtagcttttgggcactgctgcgtgaaccgcctcgttttctgctgtgtgaagaagcacagattaaacaggtgaaatccttcgaataa",
    controlBy: null,
    controlTo: {
      PsrpR: {
        controlType: "Repression",
      },
    },
    meta: null,
  },
];

/*
  Since dragging and dropping icons in Tauri apps can trigger file operations,
  we disable the drag event for the image and enable it for the parent div instead.
  To properly handle drag events via Tauri, set `tauri.windows.fileDropEnabled` to false in `tauri.conf.json`.
*/
const enableDragging = (event) => {
  event.currentTarget.draggable = true;
};

export const proteinNode = (
  <div
    className="cursor-pointer flex items-end justify-center"
    onDragStart={(event) =>
      onDragStart(event, iconUrl, nodeCategory, leftHandleStyle, rightHandleStyle, commandPaletteButtonStyle)
    }
    draggable
    onMouseDown={enableDragging}
  >
    <Image src={icon} alt={nodeCategory} draggable={false} />
  </div>
);
