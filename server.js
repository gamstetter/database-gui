var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;

var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

const PORT = 8080;

server.listen(PORT);

app.use(express.static(__dirname + '/html'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/html/main.html');
});

io.on('connection', function(socket){
    socket.on('process_query', function(queryString){
        console.log(queryString);
        makeConnection(queryString);
    });
    socket.on('process_select_statement', function(queryString){
       console.log(queryString);
       makeSelectQuery(queryString);
    });
});


function makeConnection(query){
    var config = {
        userName: 'root',
        password: 'rootPassword',
        server: 'localhost'
    };

    var connection = new Connection(config);
    connection.on('connect', function(err) {
        // If no error, then good to proceed.
        console.log('Connected!');
        console.log('Query started');
        request = new Request(query, function (err) {
            if (err) {
                console.log(err);
            }
        });

        request.on('done', function(rowCount, more) {
            if (rowCount === 1){
                socket.emit('query_status', true);
            } else if (rowCount === 0){
                socket.emit('query_status', false);
            }
            console.log('Query finished');
        });
        connection.execSql(request);
    });
}

function makeSelectQuery(query){
    var config = {
        userName: 'root',
        password: 'rootPassword',
        server: 'localhost'
    };

    var connection = new Connection(config);
    connection.on('connect', function(err) {
        request = new Request(query, function(err) {
            if (err) {
                console.log(err);}
        });
        var result = "";
        request.on('row', function(columns) {
            columns.forEach(function(column) {
                if (column.value === null) {
                    console.log('NULL');
                } else {
                    result+= column.value + " ";
                }
            });
            result += "\n";
        });

        request.on('done', function(rowCount, more) {
            console.log(rowCount + ' rows returned');
            socket.emit('results', result);
        });
        connection.execSql(request);
    });
}

