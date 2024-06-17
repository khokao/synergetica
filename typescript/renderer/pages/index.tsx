import { Resizable } from "re-resizable";
import { FileSidebar } from "../components/FileSidebar/FileSidebar";
import { GUI } from "../components/GUI/GUI";
import { Generation } from "../components/Generation/Generation";
import { Simulation } from "../components/Simulation/Simulation";

const Home = () => {
  return (
    <div className="flex h-screen">
      <Resizable
        className="border-r-2 border-black-500"
        defaultSize={{
          width: "20%",
          height: "100%",
        }}
        minWidth={"10%"}
        maxWidth={"30%"}
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
        <GUI />
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
          <Simulation />
        </Resizable>
        <Generation />
      </div>
    </div>
  );
};

export default Home;
