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
        let connection = makeConnection();
        let success = executeStatement(queryString, connection);
        socket.emit('query_status', success);
    });
});


function makeConnection(){
    var config = {
        userName: 'root',
        password: 'rootPassword',
        server: 'localhost'
    };

    var connection = new Connection(config);
    connection.on('connect', function(err) {
        // If no error, then good to proceed.
        if(!err){
            console.log("Connected");
            executeStatement();
            console.log("Statement compelete");
        } else {
            console.log(JSON.stringify(err));
        }
    });

    return connection;
}

function executeStatement(connection, query) {
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
    });
}

