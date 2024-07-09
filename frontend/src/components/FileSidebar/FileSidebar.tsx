import { DispDirTree } from "@/components/FileSidebar/LoadFileStructOpen";
import type React from "react";

export const FileSidebar: React.FC = () => {
  return (
    <div>
      <div>
        <DispDirTree />
      </div>
    </div>
  );
};
