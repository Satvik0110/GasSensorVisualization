import { Line } from 'react-chartjs-2'; // Import the Line chart component
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Graph = ({graphData}) => {
// Prepare data for Chart.js
const chartData = {
  labels: graphData.map((data) => data.timestamp), // Use 'time' for x-axis labels
  datasets: [
    {
      label: 'Sensor Value',
      data: graphData.map((data) => data.value), // Use 'value' for y-axis data
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
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
        text: 'Sensor Value',
      },
    },
  },
};


  return (
    <Line data={chartData} options={chartOptions} />
  )
}

export default Graph;