import './App.css'
import axios from "axios";
import { useState } from 'react';
import Graph from './Graph';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CSVGraph from './csvGraph';

function App() {
  const BUFFER_SIZE = 300; // Define buffer size - adjust this number as needed
  const [graphData, setgraphData]= useState([]);
  const [intervalID, setintervalID]= useState(null);
  const [sensorData, setSensorData]= useState(null);

  const getData = async () => {
    try {
      const response = await axios.get('http://10.115.139.254/json');
  
      // Add timestamp to the fetched data
      const dataWithTimestamp = {
        ...response.data,
        timestamp: Date.now()  // <-- Add current timestamp here
      };
  
      setgraphData((prevgraphData) => {
        // Keep the buffer size fixed
        if (prevgraphData.length >= BUFFER_SIZE) {
          return [...prevgraphData.slice(1), dataWithTimestamp];
        }
        return [...prevgraphData, dataWithTimestamp];
      });
  
      setSensorData(dataWithTimestamp);
    } catch (error) {
      console.log(error);
    }
  }
  

  const getContinuousData =  () =>{
    if(!intervalID){
      const id= setInterval(getData,1000);
      setintervalID(id);
    }
  }

  const downloadCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
        "timestamp,voltage,\n" +  // Ensure newline after headers
        graphData.map(data => 
            `${data.timestamp},${data.voltage}` // Ensure proper column separation
        ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sensor_data.csv");
    document.body.appendChild(link);
    link.click();
};


  const stopData =  () =>{
    if(intervalID){
       clearInterval(intervalID);
      setintervalID(null);
    }
  }

  const resetData =  () =>{
    const userConfirmed = window.confirm("Do you want to download the CSV before resetting data?");
    if (userConfirmed) {
        downloadCSV();
    }
    setSensorData(null);
    stopData();
    setgraphData([]);
  }

  return (
    <Router>
      <Routes>
        <Route path="/csvGraph" element={<CSVGraph />} />
        <Route
          path="/"
          element={
            <>
              <div className="container">
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
                    {/* <div>Sensor 2 Value: {sensorData.value2}</div>
                    <div>Sensor 3 Value: {sensorData.value3}</div>
                    <div>Sensor 4 Value: {sensorData.value4}</div>
                    <div>Temperature Value: {sensorData.Temperature}</div>
                    <div>Humidity Value: {sensorData.Humidity}</div> */}
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

     
      
    

