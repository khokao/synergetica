import { useResponse } from "@/context/GeneratorResponseContext";
import type { GeneratorResponseData } from "@/interfaces/generatorAPI";
import type React from "react";

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
