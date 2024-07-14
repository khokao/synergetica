import { onDragStart } from "@/components/GUI/Bottombar";
import icon from "@public/images/node-promoter.svg";
import Image from "next/image";
import React from "react";

const iconUrl = "/images/node-promoter.svg";
const nodeCategory = "promoter";
const leftHandleStyle = { top: 68, left: 5 };
const rightHandleStyle = { top: 68, left: 180 };
const commandPaletteButtonStyle = { top: 47, left: 11, right: 10 };
const commandPaletteOptions = [
  {
    name: "PameR",
    description: "Regulated Promoter repressed by AmeR",
    subcategory: "RepressivePromoter",
    repressedBy: "AmeR",
    repressTo: undefined,
  },
  {
    name: "PamtR",
    description: "Regulated Promoter repressed by AmtR",
    subcategory: "RepressivePromoter",
    repressedBy: "AmtR",
    repressTo: undefined,
  },
  {
    name: "Pbetl",
    description: "Regulated Promoter repressed by BetI",
    subcategory: "RepressivePromoter",
    repressedBy: "BetI",
    repressTo: undefined,
  },
  {
    name: "Pbm3r1",
    description: "Regulated Promoter repressed by BM3R1",
    subcategory: "RepressivePromoter",
    repressedBy: "BM3R1",
    repressTo: undefined,
  },
  {
    name: "PhyllR",
    description: "Regulated Promoters repressed by HylIR",
    subcategory: "RepressivePromoter",
    repressedBy: "HlyIIR",
    repressTo: undefined,
  },
  {
    name: "PlcaRA",
    description: "Regulated Promoters repressed by LcaRA",
    subcategory: "RepressivePromoter",
    repressedBy: "IcaRA",
    repressTo: undefined,
  },
  {
    name: "PlitR",
    description: "Regulated Promoter repressed by LitR",
    subcategory: "RepressivePromoter",
    repressedBy: "LitR",
    repressTo: undefined,
  },
  {
    name: "PlmrA",
    description: "Regulated Promoter repressed by LmrA",
    subcategory: "RepressivePromoter",
    repressedBy: "LmrA",
    repressTo: undefined,
  },
  {
    name: "PphlF",
    description: "Regulated Promoter repressed by PhlF",
    subcategory: "RepressivePromoter",
    repressedBy: "PhlF",
    repressTo: undefined,
  },
  {
    name: "PpsrA",
    description: "Regulated Promoter repressed by PsrA",
    subcategory: "RepressivePromoter",
    repressedBy: "PsrA",
    repressTo: undefined,
  },
  {
    name: "PqacR",
    description: "Regulated Promoter repressed by QacR",
    subcategory: "RepressivePromoter",
    repressedBy: "QacR",
    repressTo: undefined,
  },
  {
    name: "PsrpR",
    description: "Regulated Promoter repressed by SrpR",
    subcategory: "RepressivePromoter",
    repressedBy: "SrpR",
    repressTo: undefined,
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

export const promoterNode = (
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
