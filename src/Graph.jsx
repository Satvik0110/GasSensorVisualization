import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Title, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const colors = [
  'rgb(255, 99, 132)',
  'rgb(54, 162, 235)',
  'rgb(255, 206, 86)',
  'rgb(75, 192, 192)',
  'rgb(153, 102, 255)',
  'rgb(255, 159, 64)',
  'rgb(0, 200, 83)',
  'rgb(255, 87, 34)'
];

const Graph = ({ graphData, numSensors }) => {
  const allValues = [];
  for (let i = 1; i <= numSensors; i++) {
    allValues.push(...graphData.map(data => data[`value${i}`]));
  }

  const minY = Math.min(...allValues) - 0.01;
  const maxY = Math.max(...allValues) + 0.01;

  const datasets = [];
  for (let i = 1; i <= numSensors; i++) {
    datasets.push({
      label: `Sensor ${i}`,
      data: graphData.map(data => data[`value${i}`]),
      borderColor: colors[(i - 1) % colors.length],
      fill: false,
      tension: 0.1,
    });
  }

  const chartData = {
    labels: graphData.map(data => new Date(data.Timestamp).toLocaleTimeString()),
    datasets: datasets,
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      x: {
        title: { display: true, text: 'Time' },
      },
      y: {
        min: minY,
        max: maxY,
        title: { display: true, text: 'Voltage(V)' },
      },
    },
  };

  return <Line data={chartData} options={chartOptions} />;
};

export default Graph;
