export interface generatorRequestData {
  rbs_target_parameters: { [key: string]: number };
}

interface ChildNodesDetails {
  nodeCategory: string;
  sequence: string;
}

export interface GeneratorResponseData {
  group_node_details: { [key: string]: ChildNodesDetails[] };
}

export interface GeneratorError {
  error: string;
}

export type GeneratorResponseContextType = {
  response: GeneratorResponseData | GeneratorError | null;
  setResponse: React.Dispatch<React.SetStateAction<GeneratorResponseData | GeneratorError | null>>;
  callGeneratorAPI: (data: generatorRequestData) => Promise<void>;
};
