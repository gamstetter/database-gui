var Connection = require('tedious').Connection;
var config = {
    userName: 'root',
    password: '',
    server: 'WIN-09DVBCGUN6H.Reporting_developer.windows.net'
};

var connection = new Connection(config);
connection.on('connect', function(err) {
    // If no error, then good to proceed.
    console.log("Connected");
});

