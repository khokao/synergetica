export interface generatorRequestData {
  reactflow_object_json_str: string;
  rbs_target_parameters: { [key: string]: number };
}

interface ChildNodesDetails {
  nodeCategory: string;
  sequence: string;
}

export interface GeneratorResponseData {
  parent2child_details: { [key: string]: ChildNodesDetails[] };
}

export interface GeneratorError {
  error: string;
}

export type GeneratorResponseContextType = {
  response: GeneratorResponseData | GeneratorError | null;
  setResponse: React.Dispatch<React.SetStateAction<GeneratorResponseData | GeneratorError | null>>;
  callGeneratorAPI: (data: generatorRequestData) => Promise<void>;
};
