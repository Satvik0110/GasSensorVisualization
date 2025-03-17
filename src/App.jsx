import './App.css'
import axios from "axios";
import { useState } from 'react';
import Graph from './Graph';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CSVGraph from './csvGraph';

function App() {
  const [graphData, setgraphData]= useState([]);
  const [intervalID, setintervalID]= useState(null);

  const getData= async () => {
    try{
      // const response= await axios.get('http://192.168.181.254/json');
      const response= await axios.get('http://localhost:5000/api/data');
      console.log(response.data);
      setgraphData((prevgraphData) => [...prevgraphData, response.data]);
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
  }

  const downloadCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
        "timestamp,value1,value2,value3,value4,value5\n" +  // Ensure newline after headers
        graphData.map(data => 
            `${data.timestamp},${data.val1},${data.val2},${data.val3},${data.val4},${data.val5}` // Ensure proper column separation
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
    stopData();
    setgraphData([]);
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const rows = text.split('\n');
        const parsedData = rows.slice(1).map(row => {  // slice(1) skips header row
          const [timestamp, value] = row.split(',');
          return {
            timestamp: timestamp.trim(),
            value: parseFloat(value.trim())
          };
        }).filter(item => !isNaN(item.value));  // Remove any invalid entries (error handling
        
        setgraphData(parsedData);
      };
      reader.readAsText(file);
    }
  };


  return (
    <Router>
      <Routes>
        <Route path="/csvGraph" element={<CSVGraph />} />
        <Route path="/" element={
          <div className="container">
            <h2>Sensor Dashboard</h2>
            <div>
              <Link to="/csvGraph" className="csv-link">
                Go to CSV Graph
              </Link>
            </div>
            <p>Real-time sensor data visualization</p>
            <div>
              <input 
                type="file" 
                accept=".csv"
                onChange={handleFileUpload}
              />
            </div>
            <div className="button-container">
              <button className="get-button" onClick={getContinuousData}>Get</button>
              <button className="stop-button" onClick={stopData}>Stop</button>
              <button className="reset-button" onClick={resetData}>Reset</button>
            </div>
            <div className="graph-container">
              <Graph graphData={graphData} />
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;


     
      
    

