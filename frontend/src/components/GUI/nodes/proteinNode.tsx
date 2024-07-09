import { onDragStart } from "@/components/GUI/Bottombar";
import icon from "@public/images/node-protein.svg";
import Image from "next/image";
import React from "react";

const iconUrl = "/images/node-protein.svg";
const nodeCategory = "protein";
const nodeSubcategory = "protein subtype 1";
const leftHandleStyle = { top: 15, left: 6 };
const rightHandleStyle = { top: 15, left: 178 };
const selectMenuStyle = { top: -6, left: 12, right: 30 };
const selectMenuOptions = [
  { name: "protein subtype 1", description: "protein subtype 1 description" },
  { name: "protein subtype 2", description: "protein subtype 2 description" },
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
        nodeSubcategory,
        leftHandleStyle,
        rightHandleStyle,
        selectMenuStyle,
        selectMenuOptions,
      )
    }
    draggable
    onMouseDown={enableDragging}
  >
    <Image src={icon} alt={nodeCategory} draggable={false} />
  </div>
);
