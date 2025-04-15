import './App.css';
import axios from "axios";
import { useState } from 'react';
import Graph from './Graph';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CSVGraph from './csvGraph';
import logo from './IITJ_COLOURED.png'; // Import the logo

function App() {
  const BUFFER_SIZE = 50; // Define buffer size - adjust this number as needed
  const [graphData, setgraphData]= useState([]);
  const [intervalID, setintervalID]= useState(null);
  const [sensorData, setSensorData]= useState(null);

  const getData= async () => {
    try{
      // const response= await axios.get('http://192.168.181.254/json');
      //sensor1: 5, sensor2: 10,
      const response= await axios.get('http://localhost:5000/api/data');
      setgraphData((prevgraphData) => {
        // If we exceed buffer size, remove oldest data point
        if (prevgraphData.length >= BUFFER_SIZE) {
          return [...prevgraphData.slice(1), dataWithTimestamp];
        }
        return [...prevgraphData, dataWithTimestamp];
      });
      setSensorData(response.data);
    }
    catch(error){
      console.log(error);
    }
  }
  

  const getContinuousData =  () =>{
    if(!intervalID){
      const id= setInterval(getData,2000);
      setintervalID(id);
    }
  };

  const downloadCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
        "timestamp,voltage,\n" +  // Ensure newline after headers
        graphData.map(data => 
            `${data.Timestamp},${data.voltage}` // Ensure proper column separation
        ).join("\n");

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
                <img src={logo} alt="IITJ Logo" style={{ width: '50px', position: 'absolute', top: '10px', left: '10px' }} />
                <h2>Sensor Dashboard</h2>
                <div>
                  <Link to="/csvGraph" className="csv-link">
                    Go to CSV Graph
                  </Link>
                </div>
                <p>Real-time sensor data visualization</p>
                <div className="button-container">
                  <button className="get-button" onClick={getContinuousData}>
                    Get
                  </button>
                  <button className="stop-button" onClick={stopData}>Stop</button>
                  <button className="reset-button" onClick={resetData}>Reset</button>
                </div>
                {sensorData && (
                  <>
                    <div>Voltage Value: {sensorData.voltage}</div>
                  </>
                )}
                <div className="graph-container">
                  <Graph graphData={graphData} />
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





