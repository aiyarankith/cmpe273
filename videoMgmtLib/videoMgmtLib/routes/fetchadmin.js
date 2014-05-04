/**
 * New node file
 */
exports.fetchdata=function(req,res){
	var connPool = require('./dbConnectivity/mysqlConn').pool;
	console.log("log1");
	connPool.getConnection(function (err, connection) {
		//var username=req.param('username');
		//var password=req.param('password');
		var sql1 = "select * from users where user_id=? and password=? and type_of_user=?";
		var params = [req.param('uid'), req.param('password'),'admin'];
		//connection.connect();
		connection.query(sql1, params, function(err, rows,fields) {
			console.log("Rows :: "+JSON.stringify(rows));
			if (rows.length!==0) {
				req.session.admin_fname = rows[0].first_name;
				console.log("Row objects:: "+JSON.stringify(rows));
				res.render('admin_home',{
					admin_fname: req.session.admin_fname
				});
			}

			else{

				//callback(err,"error");
				console.log("error" +err);
				res.render('adminlogin', { title: 'homepage', error_message: "Invalid Login. Try again."});

			}
		});
	});
};
exports.logout=function(req,res){

	req.session = null;
	res.render('index');
};