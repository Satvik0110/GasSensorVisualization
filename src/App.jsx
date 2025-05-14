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
  const [numSensors, setNumSensors] = useState(0); // Default value

  

  const getData = async () => {
    try {
      // const response = await axios.get('http://192.168.116.254/json');
      const response = await axios.get('http://localhost:5000/api/data');
      const { values = [], temperature, humidity } = response.data;
  
      const newData = {
        Timestamp: new Date().toISOString(),
        temperature,
        humidity,
      };
  
      values.forEach((val, index) => {
        newData[`value${index + 1}`] = val;
      });
  
      setNumSensors(values.length); // Set based on API
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
                <h2>Gas Sensor Array Data Visualization</h2>
                <div>
                  <Link to="/csvGraph" className="csv-link">Go to CSV Graph</Link>
                </div>
                <p>Real-time sensor data visualization</p>
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
