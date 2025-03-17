const express=require('express');
const Router=express.Router();
const {getData} = require('../controllers/data.cjs');

Router.route('/data').get(getData);

module.exports=Router;