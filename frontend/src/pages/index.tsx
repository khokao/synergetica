import { FileSidebar } from "@/components/FileSidebar/FileSidebar";
import { GUI } from "@/components/GUI/GUI";
import { Simulation } from "@/components/Simulation/Simulation";
import { useConverterAPI,useProteinParameter } from "@/hooks/useSimulatorAPI";
import { Resizable } from "re-resizable";
import { ReactFlowProvider } from "reactflow";

const Home = () => {
  const { postConverter, ConvertResult, resetSimulator } = useConverterAPI();
  const { proteinParameter, setproteinParameter } = useProteinParameter();
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
          <GUI onClickSimulate={postConverter} />
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
          <Simulation ConvertResult={ConvertResult}
                      reseter={resetSimulator}
                      proteinParameter={proteinParameter}
                      setproteinParameter={setproteinParameter} />
        </Resizable>
      </div>
    </ReactFlowProvider>
  );
};

export default Home;
