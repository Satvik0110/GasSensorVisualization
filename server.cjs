const express= require('express');
const app=express();
const PORT=5000;
const DataRouter= require('./routes/router.cjs');
const cors = require('cors'); 
app.use(cors({
  origin: 'http://localhost:5173'
}));
app.use(express.json());
app.use('/api', DataRouter);

app.listen(PORT, () =>{
  console.log(`Server is listening on port ${PORT}...`);
})