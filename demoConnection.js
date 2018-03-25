var mysql = require('mysql');

function createConnection() {
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'Reporting_developer'
    });

    connection.connect(function (error) {
        if (error) {
            console.log(JSON.stringify(error));
        } else {
            console.log('connected!');
        }
    });
}

createConnection();