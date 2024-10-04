import type React from "react";
import { useDnD } from "@/components/Circuit/context";
import TurnRightIcon from '@mui/icons-material/TurnRight';
import TitleIcon from '@mui/icons-material/Title';
import Crop169Icon from '@mui/icons-material/Crop169';
import Tooltip from '@mui/material/Tooltip';


export const DnDPanel: React.FC = () => {
  const [_, setDnDCategory] = useDnD();

  /*
    Since dragging and dropping icons in Tauri apps can trigger file operations,
    we disable the drag event for the image and enable it for the parent div instead.
    To properly handle drag events via Tauri, set `tauri.windows.fileDropEnabled` to false in `tauri.conf.json`.
  */
  const enableDragging = (event) => {
    event.currentTarget.draggable = true;
  };

  const onDragStart = (event, nodeCategory) => {
    setDnDCategory(nodeCategory);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="flex justify-center space-x-4 bg-gray-100 shadow-lg p-2 rounded-lg">
      <Tooltip title="Promoter" arrow>
        <div
          className="cursor-pointer bg-blue-200 text-blue-800 p-1 rounded-lg flex items-center justify-center"
          onDragStart={(event) => onDragStart(event, 'promoter')}
          draggable
          onMouseDown={enableDragging}
        >
          <TurnRightIcon fontSize="large" />
        </div>
      </Tooltip>

      <Tooltip title="Protein" arrow>
        <div
          className="cursor-pointer bg-green-200 text-green-800 p-1 rounded-lg flex items-center justify-center"
          onDragStart={(event) => onDragStart(event, 'protein')}
          draggable
          onMouseDown={enableDragging}
        >
          <Crop169Icon fontSize="large" />
        </div>
      </Tooltip>

      <Tooltip title="Terminator" arrow>
        <div
          className="cursor-pointer bg-red-200 text-red-800 p-1 rounded-lg flex items-center justify-center"
          onDragStart={(event) => onDragStart(event, 'terminator')}
          draggable
          onMouseDown={enableDragging}
        >
          <TitleIcon fontSize="large" />
        </div>
      </Tooltip>
    </div>
  );
};
