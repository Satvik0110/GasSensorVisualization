const express=require('express');
const Router=express.Router();
const {getData, updateData} = require('../controllers/data.cjs');

Router.route('/data').get(getData).post(updateData);

module.exports=Router;