import { onDragStart } from "@/components/GUI/Bottombar";
import icon from "@public/images/node-terminator.svg";
import Image from "next/image";
import React from "react";

const iconUrl = "/images/node-terminator.svg";
const nodeCategory = "terminator";
const leftHandleStyle = { top: 63, left: 5 };
const rightHandleStyle = { top: 63, left: 180 };
const commandPaletteButtonStyle = { top: 42, left: 11, right: 10 };

export const terminatorCommandPaletteOptions = [
  {
    name: "L3S3P31",
    description: "Standard Terminator",
    subcategory: "StandardTerminator",
    sequence: "ccaattattgaacaccctaacgggtgtttttttttttttggtctacc",
    controlBy: null,
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

export const terminatorNode = (
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
