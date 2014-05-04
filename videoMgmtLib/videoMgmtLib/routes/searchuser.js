exports.search=function(req,res){
	res.render('searchuserpage');
}

exports.searchuser=function(req,res){
	var query=require('./dbConnectivity/mysqlQuery');
	var criteria=req.param('criteria');
	var search=req.param('search');
	console.log(criteria);
	console.log(search);
	var sqlstmt="select * from users where "+criteria+" = ?";
	query.execQuery(sqlstmt,req.param('search'),function(err,rows){
		if(rows.length!==0){
			res.render('searchuserpage',{users:rows, check:"yes"});
		}
		else
			{
				res.render('searchuserpage',{msg: "No record found"});
			}
		
	} );
	
	
	
}