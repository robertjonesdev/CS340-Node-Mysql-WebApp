var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit   : 10,
    host              : 'classmysql.engr.oregonstate.edu',
    user              : 'cs340_briesel',
    password          : '2875',
    database          : 'cs340_briesel',
    multipleStatements: true
});

module.exports.pool = pool;
