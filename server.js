var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

const PORT = 8080;

server.listen(PORT);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/main.html');
});

io.on('connection', function(socket){
    socket.on('process_query', function(queryString){
        makeConnection();
        let success = executeStatement(queryString);
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
}

function executeStatement(queryString) {
    let request = new Request(queryString, function(err) {
        if (err) {
            return false;
        }
    });

    connection.execSql(request);
    return true;
}

