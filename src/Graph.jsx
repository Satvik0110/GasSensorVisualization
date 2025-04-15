import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Graph = ({ graphData }) => {

  // Flatten all sensor values into one array
  const allValues = [
    ...graphData.map(data => data.value1),
    ...graphData.map(data => data.value2),
    ...graphData.map(data => data.value3),
    ...graphData.map(data => data.value4),
  ];

  
  // Calculate dynamic min and max with a small margin
  const minY = Math.min(...allValues) - 0.01;
  const maxY = Math.max(...allValues) + 0.01;

  const chartData = {
    labels: graphData.map(data => data.Timestamp),  // X-axis labels
    datasets: [
      {
        label: 'Sensor 1',
        data: graphData.map(data => data.value1),
        borderColor: 'rgb(255, 99, 132)',
        fill: false,
        tension: 0.1,
      },
      {
        label: 'Sensor 2',
        data: graphData.map(data => data.value2),
        borderColor: 'rgb(54, 162, 235)',
        fill: false,
        tension: 0.1,
      },
      {
        label: 'Sensor 3',
        data: graphData.map(data => data.value3),
        borderColor: 'rgb(255, 206, 86)',
        fill: false,
        tension: 0.1,
      },
      {
        label: 'Sensor 4',
        data: graphData.map(data => data.value4),
        borderColor: 'rgb(75, 192, 192)',
        fill: false,
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        type: 'category',
        title: {
          display: true,
          text: 'Time',
        },
      },
      y: {
        min: minY,
        max: maxY,
        title: {
          display: true,
          text: 'Volts',
        },
      },
    },
  };

  return <Line data={chartData} options={chartOptions} />;
};

export default Graph;
