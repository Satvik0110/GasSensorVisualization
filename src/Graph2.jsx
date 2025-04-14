import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Graph = ({ graphData }) => {

  // Extract voltages
  const voltages = graphData.map((data) => data.voltage);

  // Compute min and max of the data, with a small margin for visual clarity
  const minY = Math.min(...voltages) - 0.01;
  const maxY = Math.max(...voltages) + 0.01;

  const chartData = {
    labels: graphData.map((data) => new Date(data.timestamp).toLocaleTimeString()),  // human-readable time
    datasets: [
      {
        label: 'Voltage',
        data: voltages,
        borderColor: 'rgb(255, 99, 132)',
        fill: false,
        tension: 0.1,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: { mode: 'index', intersect: false },
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
        min: minY,     // Dynamic lower bound
        max: maxY,     // Dynamic upper bound
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
