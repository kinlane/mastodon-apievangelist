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

    var users = event.users;
    var check_users = "";
    var sql_begin = 'INSERT INTO users(name,description,url,account,followers_count,following_count,statuses_count)  VALUES';
    var sql = "";

    for (let i = 0; i < users.length; i++) {
      check_users += "'" + users[i].account.acct + "',";
    }
    
    var counter =1;
    
    check_users = check_users.substr(0,check_users.length-1);
    
     var sql1 = "SELECT account FROM users WHERE account IN(" + check_users + ")";
      connection.query(sql1, function (error, userResult, fields) {   

          // Loop through all users
          for (let i = 0; i < users.length; i++) {
            
            var already_exist = 0;
            for (let j = 0; j < userResult.length; j++) {
              if(users[i].account.acct == userResult[j].account){
                already_exist = 1;  
                }
              }
            
            if(already_exist == 0){
              
              var description = users[i].account.note;
              description = description.replace(/[^a-zA-Z0-9 ]/, '');
              description = description.replace(/'/g, 'A');
              description = description.replace(/<[^>]*>?/gm, '');
              description = description.replace(/(\r\n|\r|\n)/g, '<br>');
              description = description.replace(/[^\w\s]/gi, '')
              description = description.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');

              
              var display_name = users[i].account.display_name;
              display_name = display_name.replace(/[^a-zA-Z0-9 ]/, '');
              display_name = display_name.replace(/'/g, 'A');
              
              var account = users[i].account.acct;
              
              //if(counter < 3){
                sql += '(' + connection.escape(display_name) + ',' + connection.escape(description) + ',' + connection.escape(users[i].account.url) + ',' + connection.escape(account) + ',' + connection.escape(users[i].account.followers_count) + ',' + connection.escape(users[i].account.following_count) + ',' + connection.escape(users[i].account.statuses_count) + '),';            
                counter++;
                //}
              }              
              
            }
          
          if(sql != ''){
            
            sql = sql.substr(0,sql.length-1);
            
            sql = sql_begin + sql;

            connection.query(sql, function (error, userResult, fields) {        
              if(error){
                var response = {};
                response.insert = 0
                callback( null, response);
              }
              else{
                if(userResult.affectedRows){
                var response = {};
                response.insert = userResult.affectedRows;
                callback( null, response );
                }
                }
              }); 
            }
          else{
            console.log("2");
            callback( null, "Nothing to INSERT" );
          }
        
      });    

});