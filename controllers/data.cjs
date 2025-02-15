time=0;
data=5;


const getData = (req,res) => {
  return res.status(200).json({"timestamp": time++, "value": data++});
}

const updateData = (req,res) => {
  time=0;
  data=5;
  return res.status(201).json({"status":"successful"});
}

module.exports={getData, updateData};