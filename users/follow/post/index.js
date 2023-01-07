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
    
    
    var description = event.user.note;
    description = description.replace(/[^a-zA-Z0-9 ]/, '');
    description = description.replace(/'/g, 'A');
    description = description.replace(/<[^>]*>?/gm, '');
    description = description.replace(/(\r\n|\r|\n)/g, '<br>');
    description = description.replace(/[^\w\s]/gi, '')
    description = description.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');

    var sql1 = "UPDATE users SET user_id=" + connection.escape(event.user.id) + ", account=" + connection.escape(event.user.account) + ",name=" + connection.escape(event.user.display_name) + ",description=" + connection.escape(description) + ",url=" + connection.escape(event.user.url) + ",avatar=" + connection.escape(event.user.avatar) + ",followers_count=" + connection.escape(event.user.followers_count) + ",following_count=" + connection.escape(event.user.following_count) + ",statuses_count=" + connection.escape(event.user.statuses_count) + ",followed=1,profiled=1 WHERE account = " + connection.escape(event.user.account);
    connection.query(sql1, function (error, result, fields) {   

      callback( null, result );

    });    

});