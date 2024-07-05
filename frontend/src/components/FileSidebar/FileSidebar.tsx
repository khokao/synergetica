import React from "react";
import { DispDirTree } from "@/components/FileSidebar/LoadFileStructOpen";

export const FileSidebar: React.FC = () => {
  return (
    <div>
      <div>
        <DispDirTree />
      </div>
    </div>
  );
};
