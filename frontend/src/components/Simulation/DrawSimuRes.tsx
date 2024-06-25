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

	useEffect(() => {
		axios.get('http://127.0.0.1:8000/graph')
		  .then(response => {
			  setGraphdata(response.data.data1);
			  setGraphdata2(response.data.data2)
			  setTimes(response.data.time);
		  });
	  }, []);


	const options = {
	  responsive: true,
	  plugins: {
		title: {
		  display: true,
		  text: "Simulation Result",
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
		  },
		
		  {
			label: 'Data 2',
			data: graphdata2,
			borderColor: 'rgb(54, 162, 235)',
			backgroundColor: 'rgba(54, 162, 235, 0.5)',
		  }
	  ],
	};
  
	return (
	  <>
		<Line options={options} data={data} />
	  </>
	);
  };
  
  export default Graph;
  