var mysql= require('mysql');
connection= mysql.createConnection({

	  host : 'localhost',
  user : 'root',
  password : 'admin',
  port : '8084',
  database: 'mysql'
});

connection.connect();

connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
  if (err) throw err;
  console.log('The solution is: ', rows[0].solution);
});


connection.end();

//comment