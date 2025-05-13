import './App.css';
import axios from "axios";
import { useState } from 'react';
import Graph from './Graph';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CSVGraph from './csvGraph';
import logo from './IITJ_COLOURED.png';

function App() {
  const BUFFER_SIZE = 50;
  const [graphData, setgraphData] = useState([]);
  const [intervalID, setintervalID] = useState(null);
  const [sensorData, setSensorData] = useState(null);
  const [numSensors, setNumSensors] = useState(4); // Default value

  const handleSensorInput = () => {
    const input = parseInt(prompt("Enter number of sensors:"), 10);
    if (!isNaN(input) && input > 0) {
      setNumSensors(input);
    } else {
      alert("Please enter a valid positive number.");
    }
  };

  const getData = async () => {
    try {
      const response = await axios.get('http://192.168.116.254/json');
      const newData = {
        ...response.data,
        Timestamp: new Date().toISOString(), // Add local timestamp
      };

      setgraphData(prevgraphData =>
        prevgraphData.length >= BUFFER_SIZE
          ? [...prevgraphData.slice(1), newData]
          : [...prevgraphData, newData]
      );
      setSensorData(newData);
    } catch (error) {
      console.log(error);
    }
  };

  const getContinuousData = () => {
    if (!intervalID) {
      const id = setInterval(getData, 1000);
      setintervalID(id);
    }
  };

  const downloadCSV = () => {
    let header = "timestamp";
    for (let i = 1; i <= numSensors; i++) {
      header += `,value${i}`;
    }
    const csvContent = "data:text/csv;charset=utf-8," +
      header + "\n" +
      graphData.map(data => {
        let row = `${data.Timestamp}`;
        for (let i = 1; i <= numSensors; i++) {
          row += `,${data[`value${i}`] ?? ''}`;
        }
        return row;
      }).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sensor_data.csv");
    document.body.appendChild(link);
    link.click();
  };

  const stopData = () => {
    if (intervalID) {
      clearInterval(intervalID);
      setintervalID(null);
    }
  };

  const resetData = () => {
    const userConfirmed = window.confirm("Do you want to download the CSV before resetting data?");
    if (userConfirmed) {
      downloadCSV();
    }
    setSensorData(null);
    stopData();
    setgraphData([]);
  };

  return (
    <Router>
      <Routes>
        <Route path="/csvGraph" element={<CSVGraph />} />
        <Route
          path="/"
          element={
            <>
              <div className="container">
                <img src={logo} alt="IITJ Logo" style={{ width: '150px', position: 'absolute', top: '10px', left: '10px' }} />
                <h2>Sensor Dashboard</h2>
                <div>
                  <Link to="/csvGraph" className="csv-link">Go to CSV Graph</Link>
                </div>
                <p>Real-time sensor data visualization</p>
                <button onClick={handleSensorInput}>Set Number of Sensors</button>
                <div className="button-container">
                  <button className="get-button" onClick={getContinuousData}>Get</button>
                  <button className="stop-button" onClick={stopData}>Stop</button>
                  <button className="reset-button" onClick={resetData}>Reset</button>
                </div>
                {sensorData && (
                  <div>
                    {[...Array(numSensors)].map((_, i) => (
                      <div key={i}>Sensor {i + 1} Value: {sensorData[`value${i + 1}`]}</div>
                    ))}
                    <div>Temperature Value: {sensorData.temperature}</div>
                    <div>Humidity Value: {sensorData.humidity}</div>
                  </div>
                )}
                <div className="graph-container">
                  <Graph graphData={graphData} numSensors={numSensors} />
                </div>
              </div>
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
