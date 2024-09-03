import { FileSidebar } from "@/components/FileSidebar/FileSidebar";
import { GUI } from "@/components/GUI/GUI";
import { Simulation } from "@/components/Simulation/Simulation";
import { Resizable } from "re-resizable";
import { ReactFlowProvider } from "reactflow";

const Home = () => {
  return (
    // Wrap all with ReactFlowProvider to access ReactFlow state globally.
    <ReactFlowProvider>
      <div className="flex h-screen">
        <Resizable
          className="border-r-2 border-black-500"
          defaultSize={{
            width: "10%",
            height: "100%",
          }}
          minWidth={"5%"}
          maxWidth={"20%"}
          enable={{ right: true }}
        >
          <FileSidebar />
        </Resizable>

        <Resizable
          className="border-r-2 border-black-500"
          defaultSize={{
            width: "45%",
            height: "100%",
          }}
          minWidth={"30%"}
          maxWidth={"50%"}
          enable={{ right: true }}
        >
          <GUI />
        </Resizable>

        <Resizable
          className="border-b-2 border-black-500"
          defaultSize={{
            width: "45%",
            height: "100%",
          }}
          minWidth={"30%"}
          maxWidth={"50%"}
          enable={{ right: true }}
        >
          <Simulation />
        </Resizable>
      </div>
    </ReactFlowProvider>
  );
};

export default Home;
