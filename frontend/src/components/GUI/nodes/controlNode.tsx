import { onDragStart } from "@/components/GUI/Bottombar";
import icon from "@public/images/node-control.svg";
import Image from "next/image";
import React from "react";

const nodeType = "control";
const iconUrl = "/images/node-control.svg";
const leftHandleStyle = { top: 15, left: 7 };
const rightHandleStyle = { top: 15, left: 178 };

/*
  Since dragging and dropping icons in Tauri apps can trigger file operations,
  we disable the drag event for the image and enable it for the parent div instead.
  To properly handle drag events via Tauri, set `tauri.windows.fileDropEnabled` to false in `tauri.conf.json`.
*/
const enableDragging = (event) => {
  event.currentTarget.draggable = true;
};

export const controlNode = (
  <div
    className="cursor-pointer flex items-end justify-center"
    onDragStart={(event) => onDragStart(event, nodeType, iconUrl, leftHandleStyle, rightHandleStyle)}
    draggable
    onMouseDown={enableDragging}
  >
    <Image src={icon} alt={nodeType} draggable={false} />
  </div>
);
