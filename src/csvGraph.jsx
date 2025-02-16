import { Line } from 'react-chartjs-2';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function CSVGraph() {
  const [graphData, setGraphData] = useState([]);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [showGraph, setShowGraph] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const rows = text.split('\n');
        const parsedData = rows
          .slice(1)
          .map(row => {
            if (!row.trim()) return null;
            const [timestamp, value] = row.split(',');
            return {
              timestamp: timestamp.trim(),
              value: parseFloat(value.trim())
            };
          })
          .filter(item => item && !isNaN(item.value));
        
        setGraphData(parsedData);
        setIsFileUploaded(true);
        setShowGraph(false);
      };
      reader.readAsText(file);
    }
  };

  const handleDisplayGraph = () => {
    setShowGraph(true);
  };

  const chartData = {
    labels: graphData.map((data) => data.timestamp),
    datasets: [
      {
        label: 'CSV Data',
        data: graphData.map((data) => data.value),
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
        type: 'category',
        title: {
          display: true,
          text: 'Time',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Value',
        },
      },
    },
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <Link to="/">← Back to Real-time Dashboard</Link>
      </div>
      <h2>CSV Data Visualization</h2>
      <div>
        <input 
          type="file" 
          accept=".csv"
          onChange={handleFileUpload}
          style={{ marginBottom: '1rem' }}
        />
        {isFileUploaded && (
          <button 
            onClick={handleDisplayGraph}
            style={{ marginLeft: '1rem' }}
          >
            Display Graph
          </button>
        )}
      </div>
      <div>
        {showGraph && <Line data={chartData} options={chartOptions} />}
      </div>
    </div>
  );
}

export default CSVGraph;
