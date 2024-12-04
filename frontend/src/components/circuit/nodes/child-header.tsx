import { RiText } from "@remixicon/react";
import { CornerUpRight, RectangleHorizontal } from "lucide-react";
import React from "react";

const headerMap = {
  Promoter: {
    text: "Promoter",
    bgColor: "bg-promoter-200",
    icon: <CornerUpRight className="text-promoter-800" data-testid="promoter-icon" />,
  },
  Protein: {
    text: "Protein",
    bgColor: "bg-protein-200",
    icon: <RectangleHorizontal className="text-protein-800" data-testid="protein-icon" />,
  },
  Terminator: {
    text: "Terminator",
    bgColor: "bg-terminator-200",
    icon: <RiText className="text-terminator-800" data-testid="terminator-icon" />,
  },
};

export const ChildHeader = ({ data }) => {
  const { category } = data;
  const { text, bgColor, icon } = headerMap[category];

  return (
    <div className={`flex justify-between items-center h-1/3 px-3 py-1 text-black font-medium rounded-t-xl ${bgColor}`}>
      <span className="tracking-wide">{text}</span>
      {icon}
    </div>
  );
};
