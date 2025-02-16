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
      const response= await axios.get('http://192.168.228.254/json');
      console.log(response.data);
      setgraphData((prevgraphData) => [...prevgraphData, response.data]);
    }
    catch(error){
      console.log(error);
    }
  }

  const getContinuousData =  () =>{
    if(!intervalID){
      const id= setInterval(getData,1000);
      setintervalID(id);
    }
  }

  const stopData =  () =>{
    if(intervalID){
       clearInterval(intervalID);
      setintervalID(null);
      console.log('Stopped');
      console.log(graphData);
    }
  }

  const resetData =  () =>{
    console.log("Data reset!!");
    setgraphData([]);
    stopData();
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
        }).filter(item => !isNaN(item.value));  // Remove any invalid entries
        
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
          <div>
            <h2>Sensor Dashboard</h2>
            <div style={{ marginBottom: '20px' }}>
              <Link to="/csvGraph" style={{
                padding: '8px 16px',
                backgroundColor: '#4CAF50',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                marginBottom: '20px',
                display: 'inline-block'
              }}>
                Go to CSV Graph
              </Link>
            </div>
            <p>Real-time sensor data visualization</p>
            <div>
              <input 
                type="file" 
                accept=".csv"
                onChange={handleFileUpload}
                style={{ marginBottom: '1rem' }}
              />
            </div>
            <button onClick={getContinuousData}>Get</button>
            <button onClick={stopData}>Stop</button>
            <button onClick={resetData}>Reset</button>
            <div>
            <Graph graphData={graphData} />
            </div>
          </div>
        } />
      </Routes>
    </Router>
  )
}

export default App


     
      
    

