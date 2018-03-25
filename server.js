var Connection = require('tedious').Connection;
var config = {
    userName: 'root', // Must have user created with below username and attribute
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

var Request = require('tedious').Request;  
var TYPES = require('tedious').TYPES;  

function executeStatement() {  
    request = new Request("SELECT * from Reporting_developer.work.statuses", function(err) {  
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
        console.log(result);  
        result ="";  
    });  

    request.on('done', function(rowCount, more) {  
    console.log(rowCount + ' rows returned');  
    });  
    connection.execSql(request);  
}  