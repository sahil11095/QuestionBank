var express = require('express');
var fs = require('fs');
var mysql = require('mysql');
var html=require('html');
var validation=require("validator");
var app = express();

var sqlquery;

app.use(express.static('public'));


app.get('/', function (req, res) {
   fs.readFile("/index.html" );
});







app.get('/process_get', function (req, res) {

	var connection=mysql.createConnection({
  		host : 'localhost',
  		user : 'root',
  		password : 'admin',
  		database: 'mysql'
	});

	connection.connect();
    response = {    
    	name : req.query.name1,
    	email : req.query.email
	};

   	if(!validation.isEmail(req.query.email)) {
        res.send("Email is Invalid!!!");
    } else if(validation.isNull(req.query.name1)){
        res.send("Name field cannot be Empty!!!");
    }
    else{
    		sqlquery= 'INSERT INTO details SET ?';
			connection.query(sqlquery,response,function(err, rows, fields){
				if(!err){
					res.send("Form submitted");
				}
				else{
					res.send("Error in submitting the form");
				}

			});
        
    }
	console.log(response);
	var json=JSON.stringify( response );
	console.log(json); 
	fs.writeFile('mailDetails.txt',function(err){
		if(!err){
			console.log("File Created:)");
		}
		else{
			console.log("Problem in Extracting Data");
		}
	});
	connection.end();
});





app.get('/generate',function(req,res){
	res.sendFile(__dirname+'/public/generate.html');
});






app.get('/download',function(req,res){
		var number= req.query.num;
		var time= req.query.times;


		if(!(validation.isNumeric(number)&&validation.isNumeric(time)))
		{
			res.send("******Input Entered is not Numeric************");
		}
		else{

			var connection=mysql.createConnection({
  			host : 'localhost',
  			user : 'root',
  			password : 'admin',
  			database: 'mysql'
			});
			connection.connect();
			sqlquery='select ID,Qtime from questions;';

			connection.query(sqlquery, function(err, rows, fields){
				var arr;

			if(!err){
				//console.log("The rows are:",rows);
				arr=generate(rows, number, time);

			}
			else{
				res.send("Extraction Problem");
				}

			});

			connection.end();

		}
	

});



function generate(rows, number, time)
{
	var arr=[];
	var arr2=[];
	var sum=0;
	var err=2;
	var UL=parseInt(time)+parseInt(err); var LL=time-err;
	var length=rows.length;
	//console.log(rows);
	if(length>number){
		for(var i=0 ; i<number ; i++)
		{
			var temp=parseInt(Math.floor(Math.random()*(length-1)+1));
			arr.push(temp);
			
		}
		console.log("Qid:"+arr);

		for(var i=0;i<number;i++){
		//	console.log(arr[i]);
			var temp=parseInt(rows[arr[i]-1].Qtime);
			arr2.push(temp);
			sum=sum+temp;
		}
		console.log("Time:"+arr2);
		console.log("Sum is:"+sum);
		console.log(UL+"   "+LL)
		var range=parseInt(time);
		var flag=0;
		while(sum<LL||sum>UL ){

			if(sum<LL){
				console.log("Verryy lesss value");

				var index= parseInt(arr2.indexOf(Math.min.apply(Math,arr2)))+1;

				var temp=parseInt(Math.floor(Math.random()*(length-1)+1));

				console.log("index: "+index+" "+"value: "+arr[index-1]);


				arr[index-1]=temp;
				var timetobereplaced=arr2[index-1];
				var newtime=parseInt(rows[arr[index-1]-1].Qtime);
				arr2[index-1]=newtime;
				sum=(sum-timetobereplaced) + newtime;
				console.log("changed index: "+arr[index-1]+" "+"changed value: "+arr2[index-1]);
				console.log("Sum : "+sum);


			

				//arr[index]

			}
			else if(sum>UL){
				var index= parseInt(arr2.indexOf(Math.max.apply(Math,arr2)))+1;

				var temp=parseInt(Math.floor(Math.random()*(length-1)+1));

				console.log("index: "+index+" "+"value: "+arr[index-1]);


				arr[index-1]=temp;
				var timetobereplaced=arr2[index-1];
				var newtime=parseInt(rows[arr[index-1]-1].Qtime);
				arr2[index-1]=newtime;
				sum=(sum-timetobereplaced) + newtime;
				console.log("changed index: "+arr[index-1]+" "+"changed value: "+arr2[index-1]);
				console.log("Sum : "+sum);





			}
		}
		console.log("Donee");
		return arr;

	}
	else{
		console.log("Too many Questions!!!!!!!!!!!!");
	}



}


app.listen(8081);