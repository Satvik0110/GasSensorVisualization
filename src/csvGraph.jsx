import { Line } from 'react-chartjs-2';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function CSVGraph() {
  const [graphData, setGraphData] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [sensorLabels, setSensorLabels] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const rows = text.split('\n').filter(row => row.trim());
        const headers = rows[0].split(',').map(header => header.trim());
        const dataRows = rows.slice(1);

        const parsedData = dataRows.map(row => {
          const values = row.split(',').map(value => value.trim());
          const timestamp = values[0];
          const sensorValues = values.slice(1).map(value => parseFloat(value));
          return { timestamp, sensorValues };
        });

        setGraphData(parsedData);
        setSensorLabels(headers.slice(1)); // Exclude the first column (timestamp)
        setDisplayData([]);
        setIsFileUploaded(true);
        setShowGraph(false);
      };
      reader.readAsText(file);
    }
  };

  const handleDisplayGraph = () => {
    setShowGraph(true);
    setIsAnimating(true);
    setDisplayData([]); // Reset display data
  };

  // Animation effect without buffer management
  useEffect(() => {
    if (showGraph && isAnimating && displayData.length < graphData.length) {
      const timer = setTimeout(() => {
        setDisplayData(prev => [...prev, graphData[prev.length]]);
      }, 0.0001);

      return () => clearTimeout(timer);
    } else if (displayData.length === graphData.length) {
      setIsAnimating(false);
    }
  }, [showGraph, displayData, graphData, isAnimating]);

  const chartData = {
    labels: displayData.map((data) => data.timestamp),
    datasets: sensorLabels.map((label, index) => ({
      label: label || `Sensor ${index + 1}`,
      data: displayData.map((data) => data.sensorValues[index]),
      fill: false,
      borderColor: `hsl(${(index * 60) % 360}, 70%, 50%)`, // Generate unique colors
      tension: 0.1,
    })),
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
          text: 'Sensor Values',
        },
      },
    },
    animation: {
      duration: 0, // Disable default animations
    },
  };

  return (
    <div className="container">
      <div style={{ margin: '10px 0 20px 10px' }}>
        <Link to="/" className="back-button">
          Back to Real-time Dashboard
        </Link>
      </div>
      <h2>CSV Data Visualization</h2>
      <div className="upload-container">
        <input 
          type="file" 
          accept=".csv"
          onChange={handleFileUpload}
          style={{ marginBottom: '1rem' }}
        />
        {isFileUploaded && (
          <button 
            onClick={handleDisplayGraph}
            className="display-button"
            disabled={isAnimating}
          >
            {isAnimating ? 'Plotting...' : 'Display Graph'}
          </button>
        )}
      </div>
      <div>
        {showGraph && <Line data={chartData} options={chartOptions} />}
      </div>
      {isAnimating && (
        <div style={{ marginTop: '10px' }}>
          Plotting points: {displayData.length} of {graphData.length}
        </div>
      )}
    </div>
  );
}

export default CSVGraph;
