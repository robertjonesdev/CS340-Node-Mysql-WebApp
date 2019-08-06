var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit   : 10,
    host              : 'classmysql.engr.oregonstate.edu',
    user              : 'cs340_jonesro4',
    password          : '2540',
    database          : 'cs340_jonesro4',
    multipleStatements: true
});

module.exports.pool = pool;
