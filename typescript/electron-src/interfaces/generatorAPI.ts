export interface generatorRequestData {
  rbs_parameter: number;
  rbs_upstream: string;
  rbs_downstream: string;
  promoter_parameter: number;
  promoter_upstream: string;
}

export interface GeneratorResponseData {
  rbs_sequence: string;
  promoter_sequence: string;
}

export interface GeneratorError {
  error: string;
}
