var mysql_pool = require('mysql');

/* MYSQL RDS */
var pool  = mysql_pool.createPool({
	host     : 'demoapp.cnfiarybvhfe.us-west-1.rds.amazonaws.com',
	user     : 'root',
	password : 'rootroot',
	port     : '3306',
	database : 'sampledb',
	connectionLimit : '10'
});


/* LOCAL MYSQL CONNECTION*/
// var pool  = mysql_pool.createPool({

// 	host     : 'localhost',
// 	user     : 'root',
// 	password : 'root',
// 	port     : '3306',
// 	database : 'users',
// 	connectionLimit : '10'
// });



exports.pool = pool;
