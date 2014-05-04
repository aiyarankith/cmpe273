/**
 * New node file
 */
exports.display=function (req, res) {
	var query = require('./dbConnectivity/mysqlQuery');
	var sql = "SELECT * FROM USERS WHERE USER_ID = ?";
	var param = req.session.username;
	query.execQuery(sql, param, function(err, rows, fields) {
	    	if(rows.length!==0){
				var firstname=rows[0].first_name;
				var lastname=rows[0].last_name;
				var email=rows[0].email;
				var usertype=rows[0].type_of_user;
				var balance=rows[0].balance;
				var street=rows[0].street;
				var city=rows[0].city;
				var state=rows[0].state;
				var zip=rows[0].zipcode;
				res.render('profile',{firstname:firstname,lastname:lastname,email:email,type:usertype,balance:balance,street:street,city:city,state:state,zip:zip});
				
			}
	    	else{
	    		callback(err, 0);
	    	}
	    });
}

exports.movie=function (req, res) {
	var query = require('./dbConnectivity/mysqlQuery');
	var sql = "SELECT m_name, banner,release_date,rent_amount,category,quantity,is_returned from transactions where user_id=?";
	var param = req.session.username;
	query.execQuery(sql, param, function(err, rows, fields) {
	    	if(rows.length!==0){
				
				res.render('mymovies',{movie:rows});
				
			}
	    	else{
	    		res.render('mymovies',{nomovie:"You haven't rented any movie"});
	    	}
	    });
}

exports.changepassword=function(req,res){
	res.render('changepassword');
}

exports.changepassworddb=function(req,res){
	var query = require('./dbConnectivity/mysqlQuery');
	console.log("hello");
	var sql='select password from users where user_id=?';
	var param=req.session.username;
	query.execQuery(sql,param,function(err,rows,fields){
		var oldpwd=req.body.oldpwd.toString();
		var pwd=rows[0].password;
		var newpwd=req.param('newpwd');
		var cpw=req.param('cpw');
		if(newpwd!==cpw){
			res.render('changepassword',{nomatch:"Your Password and Confirm Password fields do not Match"});
		}
		if(pwd===oldpwd){
			var sqlStmt='update users set password=? where user_id=?';
			 var params=[req.param('newpwd'),req.session.username];
			query.execQuery(sqlStmt,params,function(err,rows){
				if (err) {
					console.log('Error in Updating Records');
				}
				else{
					res.render('home',{msg:"Your Password has been Changed Successfully"});
				}
			});
		}
		else{
			
			res.render('changepassword',{nomatch:"Your Old Password is not Correct"});
		}
	});
}