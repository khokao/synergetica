import type { GeneratorResponseData } from "@/interfaces/generatorAPI";
import type React from "react";
import useSWR from "swr";

export const Generation: React.FC = () => {
  const { data } = useSWR<GeneratorResponseData>("call_generator_api");

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
      {data && formatResponse(data)}
    </div>
  );
};
