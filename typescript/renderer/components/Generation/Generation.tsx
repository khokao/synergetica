import type { GeneratorResponseData } from "@electron/interfaces/generatorAPI";
import type React from "react";
import { useResponse } from "../../context/GeneratorResponseContext";

export const Generation: React.FC = () => {
  const { response } = useResponse();

  const formatResponse = (response: GeneratorResponseData) => {
    return (
      <div>
        <p>RBS: "{response.rbs_sequence}"</p>
        <p>Promoter: "{response.promoter_sequence}"</p>
      </div>
    );
  };

  return (
    <div className="">
      Generation Section
      {response &&
        "rbs_sequence" in response &&
        "promoter_sequence" in response &&
        formatResponse(response as GeneratorResponseData)}
    </div>
  );
};
