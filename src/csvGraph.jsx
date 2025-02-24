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

  // Animation effect
  useEffect(() => {
    if (showGraph && isAnimating && displayData.length < graphData.length) {
      const timer = setTimeout(() => {
        setDisplayData(prev => [...prev, graphData[prev.length]]);
      }, 100); // Adjust this value to control animation speed (milliseconds)

      return () => clearTimeout(timer);
    } else if (displayData.length === graphData.length) {
      setIsAnimating(false);
    }
  }, [showGraph, displayData, graphData, isAnimating]);

  const chartData = {
    labels: displayData.map((data) => data.timestamp),
    datasets: [
      {
        label: 'CSV Data',
        data: displayData.map((data) => data.value),
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
    animation: {
      duration: 0 // Disable default animations
    }
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
