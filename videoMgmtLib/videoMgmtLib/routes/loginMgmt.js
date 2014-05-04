
/*
 * GET login/register/Logout page.
 */

exports.loginPage = function(req, res){
	res.render('userlogin');
};

exports.homepage=function(req,res){
	res.render('home');
}

exports.auth = function (req, res) {
	var query = require('./dbConnectivity/mysqlQuery');
	//connection.escape(userId) to avoid SQL Injection attacks
	var sqlStmt = "select first_name from users where user_id=? and password=?";
	
	var params = [req.param('mem_id'), req.param('password')];
	//console.log(req.body.mem_id.toString());
	query.execQuery(sqlStmt, params, function(err, rows) {
		console.log(rows);
		if(rows.length !== 0) {
			var firstname;
			var lastname;
			
			req.session.username = req.param('mem_id');
			sqlStmt='select first_name,last_name from users where user_id=?';
					query.execQuery(sqlStmt,req.param('mem_id'),function(err,rows){
						
						firstname=rows[0].first_name;
						lastname=rows[0].last_name;
						
						res.render('home',{firstname:firstname,lastname:lastname});
			});
				
				
				
			} else {
				res.render('userlogin', { title: 'Login', layout:false, locals: { errorMessage: "Invalid Login. Try again."}});
			}
		
	});
};


