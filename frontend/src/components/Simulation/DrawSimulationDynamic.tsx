import { callSimulatorAPI} from "@/hooks/useSimulatorAPI";
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

const useFetchData = (params) => {
  const [graphdata, setGraphdata] = useState([]);
  const [graphdata2, setGraphdata2] = useState([]);
  const [times, setTimes] = useState([]);

  const fetchData = useCallback(async () => {
    const response = await callSimulatorAPI(params);

    setGraphdata(response.data1);
    setGraphdata2(response.data2);
    setTimes(response.time);
  }, [params]);

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

export const Graph: React.FC = () => {
  const [paramCount, setParamCount] = useState(null); // State to hold paramCount
  const [params, setParams] = useState([]);

  useEffect(() => {
    // Fetch paramCount from backend
    const fetchParamCount = async () => {
      // Replace with your API call to get paramCount
      const response = await fetch('/api/getParamCount'); // Example API call
      const data = await response.json();
      setParamCount(data.paramCount);
      setParams(Array(data.paramCount).fill(1)); // Initialize params based on paramCount
    };

    fetchParamCount();
  }, []);

  const { graphdata, graphdata2, times } = useFetchData(params);

  const handleParamChange = (index) => (event) => {
    const newParams = [...params];
    newParams[index] = Number.parseFloat(event.target.value);
    setParams(newParams);
  };

  const options = getGraphOptions();
  const data = getGraphData(times, graphdata, graphdata2);

  // Render graph and handle bars only if paramCount is fetched
  return (
    <div className="flex flex-col ml-5 h-full">
      {paramCount !== null ? (
        <>
          <div className="h-full">
            <Line options={options} data={data} />
          </div>
          <div className="flex flex-col ml-5 mb-2">
            {params.map((param, index) => (
              <ParamInput
                key={index}
                label={`α${index + 1}`}
                value={param}
                onChange={handleParamChange(index)}
              />
            ))}
          </div>
        </>
      ) : (
        <p>Loading...</p> // Show loading state while fetching paramCount
      )}
    </div>
  );
};
