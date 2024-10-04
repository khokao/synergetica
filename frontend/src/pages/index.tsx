import { FileSidebar } from "@/components/FileSidebar/FileSidebar";
import { GUI } from "@/components/GUI/GUI";
import { Simulation } from "@/components/Simulation/Simulation";
import { useConverterAPI, useSimulatorResult } from "@/hooks/useSimulatorAPI";
import { Resizable } from "re-resizable";
import { ReactFlowProvider } from "@xyflow/react";
import { Circuit } from "@/components/Circuit/Circuit";
import { DnDProvider } from "@/components/Circuit/context";

const Home = () => {
  const { postConverter, convertResult, resetSimulator } = useConverterAPI();
  const { simulatorResult, setSimulatorResult } = useSimulatorResult();
  return (
    // Wrap all with ReactFlowProvider to access ReactFlow state globally.
    <ReactFlowProvider>
      <div className="flex h-screen">
        {/* <Resizable
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
        </Resizable> */}

        <Resizable
          className="border-r-2 border-black-500"
          defaultSize={{
            width: "100%",
            height: "100%",
          }}
          minWidth={"100%"}
          maxWidth={"100%"}
          enable={{ right: true }}
        >
          {/* <GUI onClickSimulate={postConverter} /> */}
          <DnDProvider>
            <Circuit />
          </DnDProvider>
        </Resizable>

        {/* <Resizable
          className="border-b-2 border-black-500"
          defaultSize={{
            width: "45%",
            height: "100%",
          }}
          minWidth={"30%"}
          maxWidth={"50%"}
          enable={{ right: true }}
        >
          <Simulation
            convertResult={convertResult}
            reseter={resetSimulator}
            simulatorResult={simulatorResult}
            setSimulatorResult={setSimulatorResult}
          />
        </Resizable> */}
      </div>
    </ReactFlowProvider>
  );
};

export default Home;
