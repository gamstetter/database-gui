var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

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

io.on('connection', function(socket){
    socket.on('process_query', function(queryString){
        let success = executeStatement(queryString);
        socket.emit('query_status', success);
    });
});

function executeStatement(queryString) {
    let request = new Request(queryString, function(err) {
        if (err) {
            return false;
        }
    });

    connection.execSql(request);
    return true;
}  