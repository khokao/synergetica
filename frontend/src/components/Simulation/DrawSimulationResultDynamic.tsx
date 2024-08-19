import { callSimulatorAPI } from "@/hooks/useSimulatorAPI";
import { ConverterResponseData } from "@/interfaces/simulatorAPI";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const getGraphOptions = () => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: "Simulation Result",
    },
  },
  scales: {
    y: {
      min: 0,
      max: 2.5,
    },
  },
});

const getGraphData = (times, graphdata, graphdata2) => ({
  labels: times,
  datasets: [
    {
      label: "Data 1",
      data: graphdata,
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
      pointRadius: 0,
    },
    {
      label: "Data 2",
      data: graphdata2,
      borderColor: "rgb(54, 162, 235)",
      backgroundColor: "rgba(54, 162, 235, 0.5)",
      pointRadius: 0,
    },
  ],
});

const useFetchData = (param1, param2) => {
  const [graphdata, setGraphdata] = useState([]);
  const [graphdata2, setGraphdata2] = useState([]);
  const [times, setTimes] = useState([]);

  const fetchData = useCallback(async () => {
    const param_set = { param1: param1, param2: param2 };
    const response = await callSimulatorAPI(param_set);

    setGraphdata(response.data1);
    setGraphdata2(response.data2);
    setTimes(response.time);
  }, [param1, param2]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { graphdata, graphdata2, times };
};

const ParamInput = ({ label, value, onChange }) => (
  <label className="flex items-center mb-2">
  <span className="inline-block w-16">{label}</span>
  <input
    type="range"
    min="0"
    max="2"
    step="0.01"
    value={value}
    onChange={onChange}
    className="mx-2"
  />
  <span>{value}</span>
</label>
);

export const Graph: React.FC<{ ConvertResult: ConverterResponseData | null }> = ({ ConvertResult }) => {
  const [param1, setParam1] = useState(1);
  const [param2, setParam2] = useState(1.5);
  const { graphdata, graphdata2, times } = useFetchData(param1, param2);

  const [proteinParams, setProteinParams] = useState<number[]>([]);

  useEffect(() => {
    if (ConvertResult !== null) {
      console.log('result',ConvertResult);
      setProteinParams(Array(ConvertResult.num_protein).fill(1));
      const wsDefine = new WebSocket("ws://127.0.0.1/ws/define_function");
      wsDefine.onopen = () => {
        wsDefine.send(ConvertResult.function_str);
      };
    }
  }, [ConvertResult]);

  const handleProteinParamChange = (index: number) => (event) => {
    const newProteinParams = [...proteinParams];
    newProteinParams[index] = Number.parseFloat(event.target.value);
    setProteinParams(newProteinParams);
  };

  const options = getGraphOptions();
  const data = getGraphData(times, graphdata, graphdata2);

  return (
    <div className="h-full">
      {ConvertResult ? (
        <div className="flex flex-col ml-5 h-full">
          <div className="h-full">
            <Line options={options} data={data} />
          </div>
          <div className="flex flex-col ml-5 mb-4">
            {proteinParams.map((param, index) => (
              <ParamInput
                key={index}
                label={ConvertResult.proteins[index]}
                value={param}
                onChange={handleProteinParamChange(index)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center h-full text-center">
          <span>Build Circuit to Simulate</span>
          <span>
            and press
            <button type="button" className="px-2 py-1 mx-2 border-2 border-black rounded">
              Simulate
            </button>
            button
          </span>
        </div>
      )}
    </div>
  );
};
