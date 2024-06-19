/** @jsxImportSource @emotion/react */
import { useResponse } from "@/context/GeneratorResponseContext";
import type React from "react";
import { css } from "@emotion/react";

export const Simulation: React.FC = () => {
  const { callGeneratorAPI } = useResponse();

  const onCallGeneratorAPIClick = () => {
    const generatorRequestData = {
      rbs_parameter: 0.5,
      rbs_upstream: "ATG",
      rbs_downstream: "TAA",
      promoter_parameter: 0.5,
      promoter_upstream: "TATA",
    };
    callGeneratorAPI(generatorRequestData);
  };

  return (
    <div css={styles.container}>
      <div css={styles.grow}>Simulation Section</div>
      <div css={styles.buttonContainer}>
        <button type="button" onClick={onCallGeneratorAPIClick} css={styles.button}>
          Generate
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: css`
    display: flex;
    flex-direction: column;
    height: 100%;
  `,
  grow: css`
    flex-grow: 1;
  `,
  buttonContainer: css`
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;
  `,
  button: css`
    padding: 0.25rem 1rem;
    border: 2px solid black;
    border-radius: 0.25rem;
  `,
};
