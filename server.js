var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;


var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var fs = require('fs');

const PORT = 8080;


app.listen(PORT, function(){
    console.log("Listening on port: " + PORT);
});

function handler (req, res) {
    fs.readFile(__dirname + '/html/main.html',
    function (err, data) {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading index.html');
        }

        res.writeHead(200);
        res.end(data);
    });
}

io.on('connection', function(socket){
    socket.on('process_query', function(queryString){
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

