import { onDragStart } from "@/components/GUI/Bottombar";
import icon from "@public/images/node-terminator.svg";
import Image from "next/image";
import React from "react";

const nodeType = "terminator";
const iconUrl = "/images/node-terminator.svg";

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
    onDragStart={(event) => onDragStart(event, nodeType, iconUrl)}
    draggable
    onMouseDown={enableDragging}
  >
    <Image src={icon} alt={nodeType} draggable={false} />
  </div>
);
