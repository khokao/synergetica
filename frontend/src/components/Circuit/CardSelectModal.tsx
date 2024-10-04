import { useState } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SearchIcon from '@mui/icons-material/Search';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { CircuitNodeTypes, CircuitEdgeTypes, NODE_HEIGHT, PROMOTER_DATA, PROTEIN_DATA, TERMINATOR_DATA } from "@/components/Circuit/constants";
import { ReactFlow, useReactFlow, ReactFlowProvider } from "@xyflow/react";
import { produce } from 'immer';

const CircuitPreview = ({id}) => {
  const reactflow = useReactFlow();

  const { getNodes, getEdges } = reactflow;
  const nodes = getNodes();
  const edges = getEdges();

  return (
    <ReactFlowProvider>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        proOptions={{ hideAttribution: true }}
        nodeTypes={CircuitNodeTypes}
        edgeTypes={CircuitEdgeTypes}
        fitView
        fitViewOptions={{ nodes: [{ id: id }], maxZoom: 0.5}}
        nodesDraggable={false}
        nodesConnectable={false}
        nodesFocusable={false}
        edgesFocusable={false}
        elementsSelectable={false}
      />
    </ReactFlowProvider>
  )
}

const SelectMenu = ({ options, selected, handleSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOptions = options.filter(
    (o) =>
      o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center bg-gray-100 rounded-lg p-2 shadow-sm">
        <SearchIcon className="h-6 w-6 text-gray-500" />
        <input
          type="text"
          className="w-full bg-transparent text-gray-800 placeholder-gray-500 px-2 py-1 focus:outline-none"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="flex-grow overflow-y-auto mt-2">
        {filteredOptions.map((o) => (
          <button
            type="button"
            key={o.name}
            onClick={() => handleSelect(o)}
            className="group relative w-full text-left py-2 pl-3 pr-9 text-gray-600 hover:bg-gray-100 hover:text-black"
          >
            <div className="flex items-center">
              <span
                className={`ml-3 block truncate font-bold ${selected?.name === o.name ? "text-indigo-600" : ""}`}
              >
                {o.name}
              </span>
            </div>
            <div
              className={`ml-3 text-sm ${selected?.name === o.name ? "text-indigo-600" : "text-gray-500"}`}
            >
              {o.description}
            </div>
            <span
              className={`absolute inset-y-0 right-0 flex items-center pr-4 ${selected?.name === o.name ? "text-indigo-600" : "hidden"}`}
            >
              <CheckCircleIcon aria-hidden="true" className="h-5 w-5" />
            </span>
          </button>
        ))}
      </div>
    </div>
  )
};

export const CardSelectModal = ({ id, nodeCategory, nodePartsName }) => {
  const reactflow = useReactFlow();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const modalMap = {
    promoter: {
      title: "Select Promoter",
      underlineColor: "border-blue-800",
      options: PROMOTER_DATA,
    },
    protein: {
      title: "Select Protein",
      underlineColor: "border-green-800",
      options: PROTEIN_DATA,
    },
    terminator: {
      title: "Select Terminator",
      underlineColor: "border-red-800",
      options: TERMINATOR_DATA,
    }
  };

  const {title, underlineColor, options} = modalMap[nodeCategory];
  const initSelected = options.find((option) => option.name === nodePartsName);
  const [selected, setSelected] = useState(initSelected);

  const handleSelect = (option) => {
    const { getNodes, setNodes } = reactflow;
    const newNodes = produce(getNodes(), (draft) => {
      draft.forEach((node) => {
        if (node.id === id) {
          node.data.nodePartsName = option.name;
          node.data.nodeSubcategory = option.subcategory;
          node.data.sequence = option.sequence;
          node.data.partsId = option.partsId;
          node.data.controlBy = option.controlBy;
          node.data.controlTo = option.controlTo;
          node.data.meta = option.meta;
        }
      });
    });
    setNodes(newNodes);

    setSelected(option);
    handleClose();
  };

  return (
    <div className="w-full">
      <button
        onClick={handleOpen}
        className="flex justify-between items-center py-2 px-2 w-full hover:bg-gray-100"
      >
        <span className="tracking-wider text-black font-extrabold text-lg">{selected ? selected.name : ""}</span>
        <KeyboardArrowDownIcon />
      </button>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-5/6 w-5/6 bg-white shadow-lg p-6 rounded-2xl flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 id="transition-modal-title" className={`text-xl font-semibold border-b-2 ${underlineColor} pb-2 pl-4 pr-4 mx-auto text-center`}>
                {title}
              </h2>
              <button onClick={handleClose} aria-label="Close Modal">
                <HighlightOffIcon className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            <div
              className="border-2 border-gray-300 rounded-lg"
              style={{ height: NODE_HEIGHT }}
            >
              <CircuitPreview id={id} />
            </div>
            <div className="border-b border-gray-300 my-4"></div>
            <div
              className=" flex-grow overflow-y-auto"
            >
              <SelectMenu options={options} selected={selected} handleSelect={handleSelect} />
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
};
