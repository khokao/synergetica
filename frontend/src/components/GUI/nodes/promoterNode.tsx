import { onDragStart } from "@/components/GUI/Bottombar";
import icon from "@public/images/node-promoter.svg";
import Image from "next/image";
import React from "react";

const iconUrl = "/images/node-promoter.svg";
const nodeCategory = "promoter";
const nodeSubcategory = "promoter subtype 1";
const leftHandleStyle = { top: 68, left: 5 };
const rightHandleStyle = { top: 68, left: 180 };
const selectMenuStyle = { top: 47, left: 11, right: 10 };
const selectMenuOptions = [
  { name: "promoter subtype 1", description: "promoter subtype 1 description" },
  { name: "promoter subtype 2", description: "promoter subtype 2 description" },
  { name: "promoter subtype 3", description: "promoter subtype 3 description" },
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
