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
    
    var sql1 = "SELECT user_id FROM users WHERE fingered = 1 and followed = '0000-00-00' ORDER BY RAND() LIMIT 1;";
    connection.query(sql1, function (error, result, fields) {   
      callback( null, result[0] );
      });    

});