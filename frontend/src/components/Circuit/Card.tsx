import React, { useState } from "react";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import type { NodeProps } from "@xyflow/react";
import TurnRightIcon from '@mui/icons-material/TurnRight';
import TitleIcon from '@mui/icons-material/Title';
import Crop169Icon from '@mui/icons-material/Crop169';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { NODE_HEIGHT, NODE_WIDTH } from "@/components/Circuit/constants";
import { CardSelectModal } from "@/components/Circuit/CardSelectModal";

const CardHeader = ({ nodeCategory }) => {
  const headerMap = {
    promoter: {
      text: "Promoter",
      bgColor: "bg-blue-200",
      icon: <TurnRightIcon className="text-blue-800" fontSize="medium" />
    },
    protein: {
      text: "Protein",
      bgColor: "bg-green-200",
      icon: <Crop169Icon className="text-green-800" fontSize="medium" />
    },
    terminator: {
      text: "Terminator",
      bgColor: "bg-red-200",
      icon: <TitleIcon className="text-red-800" fontSize="medium" />
    }
  };

  const { text, bgColor, icon } = headerMap[nodeCategory];

  return (
    <div className={`flex justify-between items-center h-1/3 px-3 py-1 text-black font-medium rounded-t-xl ${bgColor}`}>
      <span className="tracking-wide">{text}</span>
      {icon}
    </div>
  );
};

const CardButton = ({id, nodeCategory, nodePartsName }) => {
  return (
    <div className="flex justify-between items-center h-1/3 px-2 py-2 bg-gray-50 rounded-b-xl">
      <CardSelectModal id={id} nodeCategory={nodeCategory} nodePartsName={nodePartsName}/>
    </div>
  );
}

const CardFooter = ({ id, dragging }) => {
  const reactflow = useReactFlow();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteNode = () => {
    const { getNodes, getEdges, deleteElements } = reactflow;

    const allNodes = getNodes();
    const allEdges = getEdges();

    const nodeToDelete = allNodes.find((n) => n.id === id);
    const connectedEdges = allEdges.filter((e) => e.source === id || e.target === id);

    if (nodeToDelete) {
      deleteElements({
        nodes: [nodeToDelete],
        edges: connectedEdges,
      });
    }

    handleMenuClose();
  };

  return (
    <div className="flex justify-between items-center h-1/3 px-2 py-2 bg-gray-50 rounded-b-xl">
      <span className="text-sm px-1 text-gray-500 line-clamp-2 max-h-12 overflow-hidden">
        description
      </span>

      <div>
        <IconButton
          aria-label="settings"
          onClick={handleMenuOpen}
          size="small"
          className={`text-gray-400 cursor-pointer transition-transform ${
            !dragging ? 'hover:text-blue-500' : ''
          }`}
        >
          <MoreHorizIcon fontSize="small" />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <MenuItem onClick={handleDeleteNode}>
            <DeleteForeverIcon fontSize="small" className="mr-2" />
            Delete
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
}

export const Card = ({ id, selected, dragging, parentId, data }: NodeProps) => {
  const { nodeCategory, nodePartsName } = data;

  return (
    <div
      className={`relative rounded-xl border-2 ${
        selected ? 'border-pink-600' : 'border-gray-500'
      }`}
      style={{ height: NODE_HEIGHT, width: NODE_WIDTH }}
    >
      <CardHeader nodeCategory={nodeCategory} />
      <CardButton id={id} nodeCategory={nodeCategory} nodePartsName={nodePartsName}/>
      <CardFooter id={id} dragging={dragging} />
      <Handle
        type="target"
        position={Position.Left}
        className={`w-3 h-3 rounded-full border-2 border-gray-400 ${
          data.leftHandleConnected ? `bg-gray-400` : `bg-white`
        }`}
      />
      <Handle
        type="source"
        position={Position.Right}
        className={`w-3 h-3 rounded-full border-2 border-gray-400 ${
          data.rightHandleConnected ? `bg-gray-400` : `bg-white`
        }`}
      />
    </div>
  );
};
