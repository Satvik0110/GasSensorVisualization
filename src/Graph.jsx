import { Line } from 'react-chartjs-2'; // Import the Line chart component
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Graph = ({ graphData }) => {
  // Prepare data for Chart.js with multiple datasets
  const chartData = {
    labels: graphData.map((data) => data.timestamp), // X-axis labels (timestamps)
    datasets: [
      {
        label: 'Sensor 1',
        data: graphData.map((data) => data.val1),
        borderColor: 'rgb(255, 99, 132)',
        fill: false,
        tension: 0.1,
      },
      {
        label: 'Sensor 2',
        data: graphData.map((data) => data.val2),
        borderColor: 'rgb(54, 162, 235)',
        fill: false,
        tension: 0.1,
      },
      {
        label: 'Sensor 3',
        data: graphData.map((data) => data.val3),
        borderColor: 'rgb(255, 206, 86)',
        fill: false,
        tension: 0.1,
      },
      {
        label: 'Sensor 4',
        data: graphData.map((data) => data.val4),
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
        type: 'category', // For time-based x-axis
        title: {
          display: true,
          text: 'Time',
        },
      },
      y: {
        min: 0,
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