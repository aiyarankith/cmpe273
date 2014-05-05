
/*
 * GET login/register/Logout page.
 */

exports.loginPage = function(req, res){
	res.render('userlogin');
};

exports.homepage=function(req,res){
	res.render('home');
};

exports.auth = function (req, res) {
	var query = require('./dbConnectivity/mysqlQuery');
	//connection.escape(userId) to avoid SQL Injection attacks
	var sqlStmt = "select * from users where user_id=? and password=? and type_of_user !=?";

	var params = [req.param('mem_id'), req.param('password'),'admin'];
	query.execQuery(sqlStmt, params, function(err, rows) {
		console.log(rows);
		if(rows.length !== 0) {
			req.session.member_id = req.param('mem_id');
			req.session.user_fname=rows[0].first_name;
			req.session.user_details = rows;

			var sql = "SELECT * FROM TRANSACTIONS WHERE USER_ID = ?";
			var param = [req.param('mem_id')];
			query.execQuery(sql, param, function(err, rows1, fields1) {

				req.session.movie_details = rows1;

				res.render('profile',{
					user_fname:req.session.user_fname, 
					user_member_id:req.session.member_id,
					member_details: req.session.user_details,
					movie_details: req.session.movie_details

				});
			});

		} else {
			res.render('userlogin', { title: 'Login', layout:false, locals: { errorMessage: "Invalid Login. Try again."}});
		}

	});
};

exports.user_logout=function(req,res){
	req.session = null;
	res.render('index');
};


