import { onDragStart } from "@/components/GUI/Bottombar";
import Image from "next/image";
import React from "react";

const nodeType = "promoter";
const iconUrl = "/images/node-promoter.svg";
const width = 80;
const height = 80;

export const promoterNode = (
  <div className="cursor-pointer" onDragStart={(event) => onDragStart(event, nodeType, iconUrl)} draggable>
    <Image src={iconUrl} alt={nodeType} width={width} height={height} />
  </div>
);
