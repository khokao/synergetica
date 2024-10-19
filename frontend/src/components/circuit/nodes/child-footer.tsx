"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useReactFlow } from "@xyflow/react";
import { Ellipsis, Trash2 } from "lucide-react";
import React, { useCallback } from "react";

const SettingsDropDownMenu = ({ id }) => {
  const { deleteElements, getNodes, getEdges } = useReactFlow();

  const handleDeleteNode = useCallback(() => {
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
  }, [id, deleteElements, getNodes, getEdges]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" aria-label="settings" className="p-2 rounded-full text-gray-400 !ring-0 !ring-offset-0">
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="bg-white shadow-lg">
        <DropdownMenuItem onClick={handleDeleteNode} className="flex items-center cursor-pointer p-2 hover:bg-gray-100">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const ChildFooterComponent = ({ id }) => {
  return (
    <div className="flex justify-end items-center h-1/3 px-2 py-2 bg-gray-50 rounded-b-xl">
      <SettingsDropDownMenu id={id} />
    </div>
  );
};

export const ChildFooter = React.memo(ChildFooterComponent);
