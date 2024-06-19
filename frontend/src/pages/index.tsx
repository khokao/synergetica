/** @jsxImportSource @emotion/react */
/* import { FileSidebar } from "@/components/FileSidebar/FileSidebar"; */
import { css } from "@emotion/react";
import { GUI } from "@/components/GUI/GUI";
import { Generation } from "@/components/Generation/Generation";
import { Simulation } from "@/components/Simulation/Simulation";
import { Resizable } from "re-resizable";


const Home = () => {
  return (
    <div css={flexContainer}>
      <Resizable
        css={resizableBorderRight}
        defaultSize={{
          width: "80%",
          height: "100%",
        }}
        minWidth={"30%"}
        maxWidth={"80%"}
        enable={{ right: true }}
      >
        <GUI />
      </Resizable>

      <div css={flexGrowContainer}>
        <Resizable
          css={resizableBorderBottom}
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

/* styles */
const flexContainer = css`
  display: flex;
  height: 100vh;
`;

const resizableBorderRight = css`
  border-right: 2px solid #808080;
`;

const flexGrowContainer = css`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const resizableBorderBottom = css`
  border-bottom: 2px solid #808080;
`;
