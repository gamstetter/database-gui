var express = require('express');
var app = express();

var sql = require('mssql');

app.get('/', function(req, res){
    var config = {
        user : 'root',
        password : '',
        server : 'localhost',
        database : 'Reporting_developer'
    };

    sql.connect(config, function(err){
        if (err){
            console.log('ERROR!');

        } else {
            console.log('Connected');
            var request = new sql.Request();

            request.query('select * from work.statuses', function(err, recordset){
                if (err){
                    console.log('there was a problem querying!');
                }

                res.send(recordset);
            })
        }
    });
    
    sql.close();
});

var server = app.listen(5000, function () {
    console.log('Server is running..');
});