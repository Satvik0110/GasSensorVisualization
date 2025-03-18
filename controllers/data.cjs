
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}



const getData = (req,res) => {
  const val1= getRandomInt(1,5);
  const val2= getRandomInt(5,10);
  const val3= getRandomInt(3,6);
  const val4= getRandomInt(2,5);
  const temperature= 32;
  const humidity= 30;
  return res.status(200).json({"timestamp": Date.now(), val1, val2,  val3, val4, temperature, humidity});
}



module.exports={getData};