import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Graph: React.FC = () => {
	const [graphdata, setGraphdata] = useState([]);
	const [graphdata2, setGraphdata2] = useState([]);
	const [times, setTimes] = useState([]);
	const [param1, setParam1] = useState(1);
	const [param2, setParam2] = useState(5);

	const fetchData = (param1, param2) => {
		axios.get(`http://127.0.0.1:8000/graph_interact`, {
		  params: { param1, param2 }
		})
		  .then(response => {
			setGraphdata(response.data.data1);
			setGraphdata2(response.data.data2);
			setTimes(response.data.time);
		  });
	  };
	
	useEffect(() => {
		fetchData(param1, param2);
	  }, [param1, param2]);

	const handleParam1Change = (event) => {
		setParam1(event.target.value);
	};
	
	const handleParam2Change = (event) => {
		setParam2(event.target.value);
	  };

	const options = {
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
				min: 0, // y軸の最小値を指定
				max: 2.5, // y軸の最大値を指定
			},
			},
	};
  
	
	const data = {
	  labels:times,
	  datasets: [
		{
		  label: "Data 1",
		  data: graphdata,
		  borderColor: "rgb(255, 99, 132)",
		  backgroundColor: "rgba(255, 99, 132, 0.5)",
		  pointRadius: 0,
		  },
		
		  {
			label: 'Data 2',
			data: graphdata2,
			borderColor: 'rgb(54, 162, 235)',
			  backgroundColor: 'rgba(54, 162, 235, 0.5)',
			  pointRadius: 0,
		  }
	  ],
	};
  
	return (
		<>
		  <div className="flex flex-col ml-5 h-full">
			<div className="h-full">
			  <Line options={options} data={data} />
			</div>
			<div className="flex flex-col ml-5 mb-2">
			  <label>
				 α1
				<input
				  type="range"
				  min="0"
				  max="2"
				  step="0.01"
				  value={param1}
				  onChange={handleParam1Change}
						/>
				<span>  {param1}   </span> 
			  </label>
			  <label>
				 α2   
				<input
				  type="range"
				  min="0"
				  max="2"
				  step="0.01"
				  value={param2}
				  onChange={handleParam2Change}
						/>
				<span>  {param2}   </span>
			  </label>
			</div>
		  </div>
		</>
	  );
	};
  
  export default Graph;
  