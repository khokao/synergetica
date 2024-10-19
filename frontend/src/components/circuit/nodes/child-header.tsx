import { RiText } from "@remixicon/react";
import { CornerUpRight, RectangleHorizontal } from "lucide-react";
import React from "react";

const headerMap = {
  promoter: {
    text: "Promoter",
    bgColor: "bg-blue-200",
    icon: <CornerUpRight className="text-blue-800" />,
  },
  protein: {
    text: "Protein",
    bgColor: "bg-green-200",
    icon: <RectangleHorizontal className="text-green-800" />,
  },
  terminator: {
    text: "Terminator",
    bgColor: "bg-red-200",
    icon: <RiText className="text-red-800" />,
  },
};

export const ChildHeader = ({ data }) => {
  const { nodeCategory } = data;
  const { text, bgColor, icon } = headerMap[nodeCategory];

  return (
    <div className={`flex justify-between items-center h-1/3 px-3 py-1 text-black font-medium rounded-t-xl ${bgColor}`}>
      <span className="tracking-wide">{text}</span>
      {icon}
    </div>
  );
};
