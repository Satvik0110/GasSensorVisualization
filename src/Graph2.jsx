import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Graph = ({ graphData }) => {
  // Extract voltage values
  const voltages = graphData.map((data) => data.voltage); // Changed from voltage to voltage

  // Calculate min and max with larger margins for better visualization
  const minY = Math.min(...voltages) - 0.01;  // Increased margin
  const maxY = Math.max(...voltages) + 0.01;  // Increased margin

  const chartData = {
    labels: graphData.map((data) => new Date(data.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Sensor 1',  // Changed from Voltage to Sensor 1
        data: voltages,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        fill: false,
        tension: 0.1,
        pointRadius: 3,  // Added point radius
        pointHoverRadius: 5,  // Added hover radius
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    animation: {
      duration: 0  // Disable animations for smoother updates
    },
    plugins: {
      legend: { position: 'top' },
      tooltip: { 
        mode: 'index', 
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)'  // Added tooltip styling
      },
    },
    scales: {
      x: {
        type: 'category',
        title: {
          display: true,
          text: 'Time',
          font: { weight: 'bold' }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'  // Lighter grid lines
        }
      },
      y: {
        min: minY,
        max: maxY,
        title: {
          display: true,
          text: 'Sensor Values',
          font: { weight: 'bold' }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'  // Lighter grid lines
        }
      },
    },
  };

  return <Line data={chartData} options={chartOptions} />;
};

export default Graph;
