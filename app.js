/*
 * Node.js Blades server
 * 
 * Serves all the Blades static html pages and .js files
 * 
 * URL example for dashboard
 * http://localhost:9999/dashboard/
 * 
 */
var express = require('express');
var fs = require('fs');
var app = express();
var mysql = require('mysql');

var globalConfig = require('./helpers/config');

var service = require('./service/service');

var server = app.listen(globalConfig.DeployInfo.port, function(){
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});

app.use("/", express.static(globalConfig.DeployInfo.root + '/public', {
    maxAge : 86400000
}));

app.get('/', function(req, res){
    res.send(fs.readFileSync('./public/index.html', 'utf-8'));
});
app.get('/salary/:time/:staff', getSalary);
// app.get('/rest/flows/:id', getFlowDetail);
// app.get('/rest/flows/:id/ramp', getFlowRamp);
// app.get('/rest/fn', getFraudnet);


//create connection pool
var connPool = mysql.createPool({
    host : globalConfig.DBConnInfo.dbHost,
    port : globalConfig.DBConnInfo.dbPort,
    user : globalConfig.DBConnInfo.dbUser,
    password : globalConfig.DBConnInfo.dbPasswd,
    database : globalConfig.DBConnInfo.dbSid,

    connectionLimit : 20
});


function getSalary(req, res){
     service.getSalary(req, res, connPool, req.params.time, req.params.staff);
}

// function getFlowDetail(req, res){
//     riskRestService.getFlowDetail(req, res, connPool, req.params.id);
// }

// function getFlowRamp(req, res){
//     riskRestService.getFlowRamp(req, res, connPool, req.params.id);
// }

// function getFraudnet(req, res){
//     riskRestService.getFraudnet(req, res, connPool);
// }