import './App.css'
import axios from "axios";
import { useState } from 'react';
import Graph from './Graph';

function App() {
  const [graphData, setgraphData]= useState([]);
  const [intervalID, setintervalID]= useState(null);

  const getData= async () => {
    try{
      const response= await axios.get('http://192.168.181.254/json');
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
      "timestamp,value\n" +
      graphData.map(data => `${data.timestamp},${data.value}`).join("\n");
    
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
      console.log('Stopped');
      console.log(graphData);
      downloadCSV();
    }
  }

  const resetData =  () =>{
    console.log("Data reset!!");
    setgraphData([]);
    stopData();
  }


  return (
    <div>
      <h2>Sensor Dashboard</h2>
      <p>Real-time sensor data visualization</p>
      <button onClick={getContinuousData}>Get</button>
      <button onClick={stopData}>Stop</button>
      <button onClick={resetData}>Reset</button>
      <div>
      <Graph graphData={graphData} />
      </div>
      
    </div>
  )
}

export default App


     
      
    

