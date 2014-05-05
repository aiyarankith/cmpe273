var application_root = __dirname;
var express = require("express");
var path = require("path");
var ejs = require("ejs");
var sqlquery = require("./dbConnectivity/mysqlQuery");
 
var app = express();
var port = 2014;
/*<script>
$(function(document) {
    $('#rounded-corner').oneSimpleTablePagination({});
});
</script>*/
app.configure(function () {
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser());
	app.use(express.session({secret: '1234567890QWERTY'}));
	app.use(app.router);
	app.use(express.static(path.join(application_root, "public")));
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});


/*cron job login*/
var CronJob = require('cron').CronJob;
new CronJob('* * * * *', function(){
	console.log('---------------------------------------code executed');
	//calculateFine();
}, null, true, "America/Los_Angeles");
function calculateFine()
{
	console.log('calculate fine');
	var sqlquery = require('./dbConnectivity/mysqlQuery');
	var sqlStmt = "select user_id,movie_issued from transactions where is_returned=0";
	var params = [];
	sqlquery.execQuery(sqlStmt, params, function(err, rows) {
		if(rows.length !== 0) {
			for(var iterate=0; iterate < rows.length; iterate++ )
			{
				var movieIssuedDay = rows[iterate].movie_issued;
				var day = movieIssuedDay.getDate();
				movieIssuedDay.setDate(day+30);
				var today = new Date();
				if(today > movieIssuedDay)
				{
					console.log('user will be fined');
					var updateStmt = "update users SET balance = 0.5 WHERE user_id = ?";
					var params = [rows[iterate].user_id];
					sqlquery.execQuery(updateStmt, params, function(err, rows) {
						if(rows.length !== 0) {
							console.log('data updated successfully');
						}
						else
						{	console.log('data not updated successfully');	}
					});
				}
				else
				{	console.log('user not fined');	}
			}
		}
		else
		{	console.log('no data found');	}
	});
	
	var selectInActiveUsers = "select user_id,type_of_user,registration_time from users";
	var params = [];
	sqlquery.execQuery(selectInActiveUsers, params, function(err, rows) {
		if(rows.length !== 0) {
			for(var iterate=0; iterate < rows.length; iterate++ )
			{
				var movieIssuedDay = rows[iterate].registration_time;
				var day = movieIssuedDay.getDate();
				movieIssuedDay.setDate(day+30);
				var today = new Date();
				if(today > movieIssuedDay)
				{
					if(rows[iterate].type_of_user!=='simple')
					{
						console.log('simple user status will be updated');
						var currentDate = new Date();
						var updateStmt = "update users SET type_of_user = 'simple', registration_time=NOW() WHERE user_id = ?";
						var params = [rows[iterate].user_id];
						sqlquery.execQuery(updateStmt, params, function(err, rows) {
							if(rows.length !== 0) {
								console.log('data updated successfully');
							}
							else
							{	console.log('data not updated successfully');	}
						});
					}
				}
				else
				{
					console.log('user status will not be updated');
				}
			}
		}
	});
}
app.post('/showAllMovies/:movieIndex', function (req, res) {
	var movieIndex = req.param('movieIndex');
	console.log('movie index  '+ movieIndex );
	var sqlStmt = "select * from MOVIES limit "+movieIndex+",10";
	var params = [];
	movieIndex = parseInt(movieIndex) + 10;
	sqlquery.execQuery(sqlStmt, params, function(err, rows) {
		console.log(rows.length);
		if(rows.length !== 0) {
		ejs.renderFile('movielist.ejs',
			{movieResults:rows,index:movieIndex},
			function(err, result) {
			if (!err) {res.end(result);}
			else {res.end('An error occurred');console.log(err);}
			});
		}
		else
		{
			console.log('no data found');
		}
	});
	
});
app.post('/showMovieList', function (req, res) {
	//connection.escape(userId) to avoid SQL Injection attacks
	var searchCriteria = req.param('search');
	var category = req.param('category');
	req.session.index = 0;
	console.log('search criteria  '+ searchCriteria );
	var sqlStmt = "select * from MOVIES where "+category+" like '%"+ searchCriteria +"%' limit "+movieIndex+",10";
	var params = [];
	sqlquery.execQuery(sqlStmt, params, function(err, rows) {
		console.log(rows.length);
		if(rows.length !== 0) {
			req.session.movielist = rows;
			req.session.datalength = rows.length;
			req.session.currentPage = 1;
		ejs.renderFile('index.ejs',
			{movieResults:rows,index:req.session.index,datalength:req.session.datalength,currentPage:req.session.currentPage},
			function(err, result) {
			if (!err) {res.end(result);}
			else {res.end('An error occurred');console.log(err);}
			});
		}
		else
		{
			console.log('no data found');
		}
	});
	
});
app.get('/', function (req, res) {
		ejs.renderFile('sample.ejs',
			function(err, result) {
			if (!err) {res.end(result);}
			else {res.end('An error occurred');console.log(err);}
			});
});
app.get('/nextPage/:movieIndex', function (req, res) {
	req.session.index = req.param('movieIndex');
	console.log(req.param('movieIndex'));
	req.session.currentPage = req.session.currentPage +1;
		ejs.renderFile('index.ejs',
		{movieResults:req.session.movielist, index:req.session.index,datalength:req.session.datalength,currentPage:req.session.currentPage},
		function(err, result) {
		if (!err) {res.end(result);}
		else {res.end('An error occurred');console.log(err);}
		});
});

app.get('/lastPage/:movieIndex', function (req, res) {
	if(req.param('movieIndex')<10)
	{req.session.index = 0;}
	else
	{req.session.index = req.param('movieIndex')-10;}
	console.log(req.session.index);
	req.session.currentPage = req.session.currentPage -1;
		ejs.renderFile('index.ejs',
		{movieResults:req.session.movielist, index:req.session.index,datalength:req.session.datalength,currentPage:req.session.currentPage},
		function(err, result) {
		if (!err) {res.end(result);}
		else {res.end('An error occurred');console.log(err);}
		});
});
app.listen(port);