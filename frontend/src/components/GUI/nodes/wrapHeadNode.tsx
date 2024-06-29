import { onDragStart } from "@/components/GUI/Bottombar";
import icon from "@public/images/node-wrap-head.svg";
import Image from "next/image";
import React from "react";

const nodeType = "wrapHead";
const iconUrl = "/images/node-wrap-head.svg";
const leftHandleStyle = { top: 15, left: -2 };
const rightHandleStyle = { top: 15, left: 23 };

/*
  Since dragging and dropping icons in Tauri apps can trigger file operations,
  we disable the drag event for the image and enable it for the parent div instead.
  To properly handle drag events via Tauri, set `tauri.windows.fileDropEnabled` to false in `tauri.conf.json`.
*/
const enableDragging = (event) => {
  event.currentTarget.draggable = true;
};

export const wrapHeadNode = (
  <div
    className="cursor-pointer flex items-end justify-center"
    onDragStart={(event) => onDragStart(event, nodeType, iconUrl, leftHandleStyle, rightHandleStyle)}
    draggable
    onMouseDown={enableDragging}
  >
    <Image src={icon} alt={nodeType} draggable={false} />
  </div>
);
