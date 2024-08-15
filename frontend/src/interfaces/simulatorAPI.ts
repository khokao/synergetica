export interface SimulatorRequestData {
  param1: number;
  param2: number;
}

export interface SimulatorResponseData {
  data1: number[];
  data2: number[];
  time: string[];
}

export interface ConverterRequestData {
  flow_json: string;
}

export interface ConverterResponseData {
  num_protein: number;
  proteins: string[];
}
