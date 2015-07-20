var utils = require('../helpers/utils'),
    sprintf = require('sprintf-js').sprintf,
    fs = require('fs');

function executeSQL(req, res, connPool, sqlTemplate) {
    connPool.getConnection(function(err1, connection){
        if (err1) {
            utils.log(err1);
            utils.sendFailure(res, 404, utils.dbConnectionFailed());
        } else {
            connection.query(sqlTemplate.sqlQuery, sqlTemplate.params, function(err2, rows, fields) {
                res.type('application/json');
                var contentStr = req.query.callback + "(",
                    resultArray = [];
                    resultArray.push(sqlTemplate.displayName);
                if (err2) {
                    utils.log(err2);
                } else {
                    var fieldNames = null;
                    if(fields){
                        fieldNames = fields.map(function(fieldObj){
                            return fieldObj.name;
                        });
                    }
                    for ( var i = 0; i < rows.length; ++i) {
                        resultArray.push(fieldNames.map(function(fieldName){
                            return columnValue = rows[i][fieldName];
                        }));
                    }
                    var endDate = new Date();
                    utils.log(sqlTemplate.sqlQuery);
                }
                contentStr += JSON.stringify(resultArray);
                contentStr += ");";
                res.status(200).send(contentStr);
                connection.release();
            });
        }
    });
}    

function getSalary(req, res, connPool, time, staff){
    var contentStr = req.query.callback + "(";
        contentStr += JSON.stringify(fs.readFileSync('./json/hejy.json', 'utf-8'));
        contentStr += ");";
    res.status(200).send(contentStr.replace(/\\n/g,"\n").replace(/\\r/g,"\r").replace(/\\"/g,"\""));
}

module.exports = {
    getSalary : getSalary
};