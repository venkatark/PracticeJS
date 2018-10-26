module.exports = function(app) {
 
	var express = require("express");
	var router = express.Router();
	
    const dataObj = require('../controllers/urls.controller.js');
	
	var path = __basedir + '/views/';
	
	router.use(function (req,res,next) {
		console.log("/" + req.method);
		next();
	});
	
	app.get('/', (req,res) => {
		res.sendFile(path + "index.html");
	});
 
    // Retrieve all Customers
    app.get('/api/urls/all', dataObj.getAll);
    app.get('/api/urls/proxy', dataObj.getProxy);
	
	app.get('/api/urls/mapped', dataObj.getMapped);

	app.use("/",router);
 
	app.use("*", (req,res) => {
		res.sendFile(path + "404.html");
	});
}