/**
 * New node file
 */
/**
 * New node file
 */
exports.insertmovie=function (req,res){
	//var mysql = require('mysql');
	var MOVIE_ID=req.param('MOVIE_ID');
	var MOVIE_NAME=req.param('MOVIE_NAME');
	var MOVIE_BANNER=req.param('MOVIE_BANNER');
	var RELEASE_DATE=req.param('RELEASE_DATE');
	var RENT_AMOUNT=req.param('RENT_AMOUNT');
	var AVAILABLE_COPIES= req.param('AVAILABLE_COPIES');
	var CATEGORY=req.param('CATEGORY');
	var is_published= req.param('is_published');
	console.log("we insert into movies");
	var connPool = require('./dbConnectivity/mysqlConn').pool;
	connPool.getConnection(function (err, connection) {	
	var sql = "insert into movies(MOVIE_ID,MOVIE_NAME,MOVIE_BANNER,RELEASE_DATE,RENT_AMOUNT,AVAILABLE_COPIES,CATEGORY,is_published) values (?,?,?,?,?,?,?,?)";
	connection.query(sql, [MOVIE_ID,MOVIE_NAME,MOVIE_BANNER,RELEASE_DATE,RENT_AMOUNT,AVAILABLE_COPIES,CATEGORY,is_published], function (err,rows,fields){
		if (err) {
            console.log("ERROR: " + err.message);
        }
		//console.log(results);
		res.render('index');
	});
	});
}