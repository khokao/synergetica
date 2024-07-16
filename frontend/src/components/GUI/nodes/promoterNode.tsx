import { onDragStart } from "@/components/GUI/Bottombar";
import icon from "@public/images/node-promoter.svg";
import Image from "next/image";
import React from "react";

const iconUrl = "/images/node-promoter.svg";
const nodeCategory = "promoter";
const leftHandleStyle = { top: 68, left: 5 };
const rightHandleStyle = { top: 68, left: 180 };
const commandPaletteButtonStyle = { top: 47, left: 11, right: 10 };

export const promoterCommandPaletteOptions = [
  {
    name: "PameR",
    description: "Regulated Promoter repressed by AmeR",
    subcategory: "RepressivePromoter",
    controlBy: {
      AmeR: {
        controlType: "Repression",
      },
    },
    controlTo: null,
    meta: null,
  },
  {
    name: "PamtR",
    description: "Regulated Promoter repressed by AmtR",
    subcategory: "RepressivePromoter",
    controlBy: {
      AmtR: {
        controlType: "Repression",
      },
    },
    controlTo: null,
    meta: null,
  },
  {
    name: "Pbetl",
    description: "Regulated Promoter repressed by BetI",
    subcategory: "RepressivePromoter",
    controlBy: {
      BetI: {
        controlType: "Repression",
      },
    },
    controlTo: null,
    meta: null,
  },
  {
    name: "Pbm3r1",
    description: "Regulated Promoter repressed by BM3R1",
    subcategory: "RepressivePromoter",
    controlBy: {
      BM3R1: {
        controlType: "Repression",
      },
    },
    controlTo: null,
    meta: null,
  },
  {
    name: "PhyllR",
    description: "Regulated Promoters repressed by HylIR",
    subcategory: "RepressivePromoter",
    controlBy: {
      HlyIIR: {
        controlType: "Repression",
      },
    },
    controlTo: null,
    meta: null,
  },
  {
    name: "PlcaRA",
    description: "Regulated Promoters repressed by LcaRA",
    subcategory: "RepressivePromoter",
    controlBy: {
      IcaRA: {
        controlType: "Repression",
      },
    },
    controlTo: null,
    meta: null,
  },
  {
    name: "PlitR",
    description: "Regulated Promoter repressed by LitR",
    subcategory: "RepressivePromoter",
    controlBy: {
      LitR: {
        controlType: "Repression",
      },
    },
    controlTo: null,
    meta: null,
  },
  {
    name: "PlmrA",
    description: "Regulated Promoter repressed by LmrA",
    subcategory: "RepressivePromoter",
    controlBy: {
      LmrA: {
        controlType: "Repression",
      },
    },
    controlTo: null,
    meta: null,
  },
  {
    name: "PphlF",
    description: "Regulated Promoter repressed by PhlF",
    subcategory: "RepressivePromoter",
    controlBy: {
      PhlF: {
        controlType: "Repression",
      },
    },
    controlTo: null,
    meta: null,
  },
  {
    name: "PpsrA",
    description: "Regulated Promoter repressed by PsrA",
    subcategory: "RepressivePromoter",
    controlBy: {
      PsrA: {
        controlType: "Repression",
      },
    },
    controlTo: null,
    meta: null,
  },
  {
    name: "PqacR",
    description: "Regulated Promoter repressed by QacR",
    subcategory: "RepressivePromoter",
    controlBy: {
      QacR: {
        controlType: "Repression",
      },
    },
    controlTo: null,
    meta: null,
  },
  {
    name: "PsrpR",
    description: "Regulated Promoter repressed by SrpR",
    subcategory: "RepressivePromoter",
    controlBy: {
      SrpR: {
        controlType: "Repression",
      },
    },
    controlTo: null,
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

export const promoterNode = (
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
