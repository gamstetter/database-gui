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
        makeConnection(queryString, socket);
    });
    socket.on('process_select_statement', function(queryString){
       makeSelectQuery(queryString, socket);
    });
});


function makeConnection(query, socket){
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

        request.on('requestCompleted', function(){
           socket.emit("done", true);
        });
        connection.execSql(request);
    });
}

function makeSelectQuery(query, socket){
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

        request.on('requestCompleted', function() {
            socket.emit("done", true);
        });


        request.on('row', function(columns) {
            console.log('entered row');
            let row = "";
            columns.forEach(function(column){
               if (column.value === null){
                   row += "NULL ";
               } else {
                   row += column.value + " ";
               }
            });
            socket.emit('row', row);
            console.log('finished row');
        });

        connection.execSql(request);
    });
}

