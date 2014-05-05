exports.search=function(req,res){
	res.render('searchuserpage');
};

exports.searchuser=function(req,res){
	var query=require('./dbConnectivity/mysqlQuery');
	var criteria=req.param('criteria');
	var search=req.param('search');
	var type=req.param('type');
	var userIndex = req.param('userIndex');
	console.log(userIndex+ "..............");
	console.log(req.param('criteria')+",,,,,,,,,,,,,,,,,");
	console.log(req.param('search')+",,,,,,,,,,,,,");
	var nextlast = req.param('nextlast');
	var sqlStmt = '';
	if(nextlast==='next')
	{
		console.log("this is if");
		sqlStmt = "select * from users where "+criteria+"= ? and type_of_user=? and is_active=1 limit "+userIndex+",10";
		userIndex = parseInt(userIndex) + 10;
	}
	else
	{
		console.log("this is else");
		if(userIndex<20)
		{userIndex=0;}
		else
		{userIndex = parseInt(userIndex) - 20;}
		sqlStmt = "select * from users where "+criteria+"= ? and type_of_user=? and is_active=1 limit "+userIndex+",10";
		userIndex = parseInt(userIndex) + 10;
	}	
	//var params = [];
	query.execQuery(sqlStmt, [search,req.param('type')], function(err, rows) {
		console.log(rows.length);
		if(rows.length !== 0) {
			res.render('searchuserpage',
					{users:rows,userIndex:userIndex,criteria:criteria,search:search,type:type},
					function(err, result) {
						if (!err) {res.end(result);}
						else {res.end('An error occurred');console.log(err);}
					});
		}
		else
		{
			console.log('no data found');
			res.render('searchuserpage',
					{users:[],userIndex:userIndex,criteria:criteria,search:search,type:type, norecord:"No record found"},
					function(err, result) {
						if (!err) {res.end(result);}
						else {res.end('An error occurred');console.log(err);}
					});
		}
	//console.log(criteria);
	//console.log(search);
	
		
	} );
	
	
	
};

exports.listRentedMembers = function(req,res) {
	var query=require('./dbConnectivity/mysqlQuery');
	var criteria=req.param('criteria');
	var search=req.param('search');
	console.log(criteria);
	console.log(search);
	var sqlstmt="select u.first_name, u.last_name, u.email, u.user_id, u.type_of_user, t.rent_amount, t.is_returned from users u join transactions t on u.user_id = t.user_id and t.movie_id = ?";
	query.execQuery(sqlstmt, req.param('m_id'), function(err,rows){
		if(rows.length!==0){
			res.render('searchuserpage',{users:rows, check:"yes"});
		}
		else
		{
			res.render('searchuserpage',{msg: "No record found"});
		}
	});
};
