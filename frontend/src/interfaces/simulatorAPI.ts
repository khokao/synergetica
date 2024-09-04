export interface ConverterRequestData {
  flow_json: string;
}

export interface ConverterResponseData {
  num_protein: number;
  proteins: { [key: string]: string };
  function_str: string;
}
