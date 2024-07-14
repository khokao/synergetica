import { onDragStart } from "@/components/GUI/Bottombar";
import icon from "@public/images/node-protein.svg";
import Image from "next/image";
import React from "react";

const iconUrl = "/images/node-protein.svg";
const nodeCategory = "protein";
const leftHandleStyle = { top: 15, left: 6 };
const rightHandleStyle = { top: 15, left: 178 };
const commandPaletteButtonStyle = { top: -6, left: 12, right: 30 };
const commandPaletteOptions = [
  {
    name: "AmeR",
    description: "Repressor Protein of PameR",
    subcategory: "RepressorProtein",
    repressedBy: undefined,
    repressTo: "PameR",
  },
  {
    name: "AmtR",
    description: "Repressor Protein of PamtR",
    subcategory: "RepressorProtein",
    repressedBy: undefined,
    repressTo: "PamtR",
  },
  {
    name: "BetI",
    description: "Repressor Protein of Betl",
    subcategory: "RepressorProtein",
    repressedBy: undefined,
    repressTo: "Pbetl",
  },
  {
    name: "BM3R1",
    description: "Repressor Protein of Pbm3R1",
    subcategory: "RepressorProtein",
    repressedBy: undefined,
    repressTo: "Pbm3r1",
  },
  {
    name: "HlyIIR",
    description: "Repressor Protein of PhyllR",
    subcategory: "RepressorProtein",
    repressedBy: undefined,
    repressTo: "PhyllR",
  },
  {
    name: "IcaRA",
    description: "Repressor Protein of PlcaRA",
    subcategory: "RepressorProtein",
    repressedBy: undefined,
    repressTo: "PlcaRA",
  },
  {
    name: "LitR",
    description: "Repressor Protein of PlitR",
    subcategory: "RepressorProtein",
    repressedBy: undefined,
    repressTo: "PlitR",
  },
  {
    name: "LmrA",
    description: "Repressor Protein of PlmrA",
    subcategory: "RepressorProtein",
    repressedBy: undefined,
    repressTo: "PlmrA",
  },
  {
    name: "PhlF",
    description: "Repressor Protein of PphlF",
    subcategory: "RepressorProtein",
    repressedBy: undefined,
    repressTo: "PphlF",
  },
  {
    name: "PsrA",
    description: "Repressor Protein of PpsrA",
    subcategory: "RepressorProtein",
    repressedBy: undefined,
    repressTo: "PpsrA",
  },
  {
    name: "QacR",
    description: "Repressor Protein of PqacR",
    subcategory: "RepressorProtein",
    repressedBy: undefined,
    repressTo: "PqacR",
  },
  {
    name: "SrpR",
    description: "Repressor Protein of PsrpR",
    subcategory: "RepressorProtein",
    repressedBy: undefined,
    repressTo: "PsrpR",
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
      onDragStart(
        event,
        iconUrl,
        nodeCategory,
        leftHandleStyle,
        rightHandleStyle,
        commandPaletteButtonStyle,
        commandPaletteOptions,
      )
    }
    draggable
    onMouseDown={enableDragging}
  >
    <Image src={icon} alt={nodeCategory} draggable={false} />
  </div>
);
