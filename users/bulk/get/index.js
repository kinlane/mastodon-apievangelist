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

    if(event.name && event.name != '' && event.key == 'akkess'){
        
        var sql = 'INSERT INTO users(name,description,url)';

        sql += " VALUES(" + connection.escape(event.name) + "," + connection.escape(event.description) + "," + connection.escape(event.url) + ")";
  
        connection.query(sql, function (error, results, fields) {
      
          var response = {};
          response['id'] = results.insertId;
          response['name'] = event.name;
    
          callback( null, response );
    
        });
    }
    else{
        
      var response = {};
      response['id'] = 0;
      response['name'] = event.name;
      
      callback( null, event );
    }
});