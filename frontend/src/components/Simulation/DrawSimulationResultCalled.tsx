import { callSimulatorAPI, callBackendStateAPI } from "@/hooks/useSimulatorAPI";
import type { ConverterResponseData } from "@/interfaces/simulatorAPI";
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
import useSWR from "swr";

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
  <label>
    {label}
    <input type="range" min="0" max="2" step="0.01" value={value} onChange={onChange} />
    <span> {value} </span>
  </label>
);

const fetchBackendState = async () => {
  const response = await callBackendStateAPI();
  return response;
};

export const Graph: React.FC = () => {
  const backState = useSWR('backendState', fetchBackendState,
    {
      fallbackData: { num_protein: 0, proteins: [] },
      refreshInterval: 100});
  console.log("backState",backState.data);
  const [param1, setParam1] = useState(1);
  const [param2, setParam2] = useState(1.5);
  
  const { graphdata, graphdata2, times } = useFetchData(param1, param2);

  const handleParam1Change = (event) => {
    setParam1(Number.parseFloat(event.target.value));
  };

  const handleParam2Change = (event) => {
    setParam2(Number.parseFloat(event.target.value));
  };

  const options = getGraphOptions();
  const data = getGraphData(times, graphdata, graphdata2);

  return (
    <div>
    {backState.data.num_protein !== 0 ?(
    <div className="flex flex-col ml-5 h-full">
      <div className="h-full">
        <Line options={options} data={data} />
      </div>
      <div className="flex flex-col ml-5 mb-2">
        <ParamInput label="α1" value={param1} onChange={handleParam1Change} />
        <ParamInput label="α2" value={param2} onChange={handleParam2Change} />
      </div>
    </div>
    ) : (
      <div>Loading...</div>
      )}
    </div>
  );
};
