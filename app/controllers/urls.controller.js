// Fetch all Customers
var dataObj = [];
var readlines = require('n-readlines');
var HashMap = require('hashmap');
var clusterMap = new HashMap();
var modjkMap = new HashMap();

// var follow = require('text-file-follower');
// var follower = follow('../../../../robot285/modjk.log', { persistent: true,catchup: true});

// follower.on('line', function(filename, line) {
// 	var res = line.split(" ");
// 	var data = {};
// 	data.uri = res[7];
// 	data.modjk = res[6];
// 	data.modproxy = "0";
// 	data.https = "0";

// 	dataObj.push(data);
// 	console.log(datamap);
// });
// console.log('datamap');
function processClusterFile(inputFile, map) {
	var liner = new readlines(inputFile);
	let line;
	
	while (line = liner.next()) {
		
		var res = line.toString('utf-8').match(/"(?:\\"|\\\\|[^"])*"|\S+/g);
		var dval = (parseFloat(res[10]));
		var uri = res[5].split(' ')[1].split("?")[0].replace(/(^"|"$)/g, '');

		if (uri.match(/\./g) || uri=="/")
			continue;

		if (map.has(uri)) {
			var data1 = map.get(uri);
			data1.modproxyTotal = data1.modproxyTotal + dval;
			data1.count++;
			data1.modproxy = round(data1.modproxyTotal/(data1.count*1000), 3);
			map.set(uri,data1);
		}

		else {

		var data = {};

		data.uri = uri;
		data.modproxy = round(dval/1000,3);
		data.modproxyTotal = dval;
		data.count = 1;
		data.https = "0";
		map.set(uri,data);
	}
		// console.log(res);
	}
    return map.values();
}

// expected seconds'.'microseconds
function toMicroSeconds(value)
{
	var values = value.split('.');
	var microSeconds = parseFloat(values[0])*1000000 + parseFloat(values[1])
	return microSeconds;
}

function round(value, decimals) {
    return parseFloat(Number(Math.round(value +'e'+ decimals) +'e-'+ decimals).toFixed(decimals));
}

function processModjkFile(inputFile, map) {
	var liner = new readlines(inputFile);
	
	let line;
	while (line = liner.next()) {
		var res = line.toString('ascii').split(" ");
		var dval = toMicroSeconds(res[6]);
		var uri = res[7].split("?")[0].replace(/(^"|"$)/g, '');
		if (uri.match(/:/g))
			continue;
		if (map.has(uri)) {
			var data1 = map.get(uri);
			data1.modjkTotal = data1.modjkTotal + dval;
			data1.count++;
			data1.modjk = round(data1.modjkTotal/(data1.count*1000), 3);
			map.set(uri,data1);
		}

		else {
		var data = {};

		data.uri = uri;
		data.modjk = round(dval/1000,3);
		data.modjkTotal = dval;
		data.count = 1;
		map.set(uri,data);
	}
		// console.log(res);
	}
    return map.values();
}


// console.log("procedded "+ dataObj);

exports.getAll = (req, res) => {

	if (modjkMap.length)
	{
		res.send(modjkMap.values()); 
		return;
	}

	const testFolder = '/';
	const fs = require('fs');

	fs.readdirSync(testFolder).forEach(file => {
		if (file.endsWith(".gz"))
		{
			//skip
			return;
		}
		if (file.match("modjk"))
		{
  			console.log(testFolder+"/"+file);
  			processModjkFile(testFolder+"/"+file, modjkMap);
  		}
	});

	
	
	// dataObj = processFile('./modjk.log');
	// console.log("--->Get All Urls: \n" + JSON.stringify(dataObj, null, 4));
    res.send(modjkMap.values()); 
};

exports.getProxy = (req, res) => {
	if (clusterMap.length)
	{
		res.send(clusterMap.values());
		return;
	}

	const testFolder = '/';
	const fs = require('fs');

	fs.readdirSync(testFolder).forEach(file => {
		if (file.endsWith(".gz"))
		{
			//skip
			return;
		}
		if (file.match("cluster"))
		{
  			console.log(testFolder+"/"+file);
  			processClusterFile(testFolder+"/"+file, clusterMap);
  		}
	});
	// dataObj = processFile('./modjk.log');
	// console.log("--->Get All Urls: \n" + JSON.stringify(dataObj, null, 4));
    res.send(clusterMap.values());
};

exports.getMapped = (req, res) => {

	var mapp = new HashMap();

	clusterMap.forEach(function(value, url) {
    	// console.log(url + " : " + value);
	
    	if (modjkMap.has(url))
    	{
			var data = {};
			var cluster = clusterMap.get(url);
    		var modjk = modjkMap.get(url);
			
			data.uri = url;
			data.modjk = modjk.modjk;
			data.modjkTotal = modjk.modjkTotal;
			data.modproxy = cluster.modproxy;
			data.modproxyTotal = cluster.modproxyTotal;
			mapp.set(url,data);
    	}
	});
	res.send(mapp.values());
};