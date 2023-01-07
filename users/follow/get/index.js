const vandium = require('vandium');
const mysql  = require('mysql');

exports.handler = vandium.generic()
  .handler( (event, context, callback) => {

    var connection = mysql.createConnection({
    host     : process.env.host,
    user     : process.env.user,
    password : process.env.password,
    database : process.env.database
    });
    
    var sql1 = "SELECT account FROM users WHERE followed = 0 ORDER BY RAND() LIMIT 1;";
    connection.query(sql1, function (error, result, fields) {   
      callback( null, result[0] );
      });    

});