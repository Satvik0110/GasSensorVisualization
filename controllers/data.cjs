function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getData = (req, res) => {
  const value1 = getRandomInt(1, 5);
  const value2 = getRandomInt(2, 5);
  const value3 = getRandomInt(1, 3);
  const value4 = getRandomInt(1, 4);
  return res.status(200).json({ 
    timestamp: Date.now(), 
    value1, 
    value2, 
    value3, 
    value4 
  });
};

module.exports = { getData };