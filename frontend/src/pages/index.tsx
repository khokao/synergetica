import { FileSidebar } from "@/components/FileSidebar/FileSidebar";
import { GUI } from "@/components/GUI/GUI";
import { Generation } from "@/components/Generation/Generation";
import { Simulation } from "@/components/Simulation/Simulation";
import { Resizable } from "re-resizable";
import { useConverterAPI } from "@/hooks/useSimulatorAPI";

const Home = () => {
  const { postConverter, ConvertResult,resetSimulator } = useConverterAPI();
  return (
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
          width: "40%",
          height: "100%",
        }}
        minWidth={"30%"}
        maxWidth={"50%"}
        enable={{ right: true }}
      >
        <GUI onClickSimulate={postConverter} />
      </Resizable>

      <div className="flex flex-col flex-grow">
        <Resizable
          className="border-b-2 border-black-500"
          defaultSize={{
            width: "100%",
            height: "70%",
          }}
          minHeight={"10%"}
          maxHeight={"90%"}
          enable={{ bottom: true }}
        >
          <Simulation ConvertResult={ConvertResult} reseter={resetSimulator} />
        </Resizable>
        <Generation />
      </div>
    </div>
  );
};

export default Home;
