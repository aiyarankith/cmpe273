
/**
 * Module dependencies.
 */

var application_root = __dirname
, express = require('express')
, routes = require('./routes')
, user = require('./routes/user')
, http = require('http')
, path = require('path')
, loginMgmt = require('./routes/loginMgmt')
, fetchadmin=require('./routes/fetchadmin')
, adduser=require('./routes/adduser')
, profile=require('./routes/profile')
, movie = require('./routes/movieHandler')
, cart = require('./routes/cartHandler')
, searchuser=require('./routes/searchuser')
, app = express(); // To create an express server.
var mysql_member_details = require("./routes/mysql_member_details");

//all environments
app.set('port', process.env.PORT || 4400);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.configure(function () {
//	app.use(express.bodyParser());
	app.use(express.json());
	app.use(express.urlencoded());
	app.use(express.methodOverride());
//	app.use(express.cookieParser());																						//Parses the Cookie header field and populates req.cookies 
	app.use(express.cookieParser("thissecretrocks"));
	app.use(express.cookieSession({ secret: 'xDDFsdfddsdfSDdbg', cookie: { maxAge: null }}));									//To maintain cookie-based sessions and populates req.session
	app.use(app.router);
	app.use(express.static(path.join(application_root, "public")));
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

//To log server creation.
function requestLog () {
	console.log('TimeStamp:'+ new Date() + ' Express server created. Listening @ port:' + app.get('port'));
}
http.createServer(app, requestLog()).listen(app.get('port'));

/*
 * List of routes
 */
//Index page
app.get('/', routes.index);
app.get('/userlogin',loginMgmt.loginPage);
app.post('/login',loginMgmt.auth);
app.get('/profile',profile.display);
app.get('/mymovies',profile.movie);
app.post('/changepass',profile.changepassworddb);
app.get('/changepass',profile.changepassword);
app.get('/home',loginMgmt.homepage);
app.post('/showMovieList',movie.showMovieList);
app.get('/nextPage/:movieIndex',movie.nextPage);
app.get('/lastPage/:movieIndex',movie.lastPage);
app.get('/index', function(req, res){
	res.render('index.ejs');
});
//Admin Login Page
app.get('/adminlogin', function(req, res){
	res.render('adminlogin.ejs');

});
//Admin Login Validated and Redirection to Home Page (admin)
app.post('/validate', fetchadmin.fetchdata);
//Admin Logout
app.get('/logout', fetchadmin.logout);
//Admin Home Page (Shows Up only when logged in)
app.get('/admin_home', function(req, res){
	if(req.session.admin_fname != null){
		res.render('admin_home', {
			admin_fname: req.session.admin_fname
		});
	} else {
		res.render('adminlogin',{
			error_message: "Please Login to Access",
			message: " ",
			member_id: ""
		});
	}
});
//User Registration Page
app.get('/userreg', function(req, res){
	res.render('userreg.ejs',{
		admin_fname: req.session.admin_fname});

});

//Movie Addition Page
app.get('/registermovie', function(req, res){
	res.render('registermovie');
});

app.post('/user_registration', adduser.insert);


//To handle movie details: Show specific movie details, Update movie, Delete movie, and Add to cart. 
app.get('/movie/show/:m_id', movie.show);
app.post('/movie/update/:m_id', movie.update);
app.post('/movie/delete/:m_id', movie.unPublish);
app.post('/movie/cart/add/:m_id', cart.add);
app.post('/movie/cart/remove/:m_id', cart.remove);
app.get('/movie/cart/show/:m_id', cart.view);	

//Member Search
app.get('/searchuser', searchuser.search);
app.post('/searchuser',searchuser.searchuser);


//Member Search Results 
app.get('/members', function(req, res){
	mysql_member_details.fetch_results(function(err,results){
		console.log("Member Results: ", results);
		if(err){
			throw err;
		}else{
			res.render('member_search_results.ejs',
					{title: "Member Search Results",
				results : results,
					});
		}
	});
});

//Member Details Page
app.get('/member_details', function(req, res){
	mysql_member_details.fetch_details(function(err,result1){
		console.log("Member Details: ", result1);
		if(err){
			throw err;
		}
		else {
			mysql_member_details.fetch_history(function(err,result2){
				console.log("Member History 1: ", result1);
				console.log("Member History 2: ", result2);

				if(err){
					throw err;
				}else{
					res.render('member_details.ejs',
							{title: "Member Details",
						results : result1,
						results1: result2
							});
				}
			},req.param("id"));

		}
	},req.param("id"));

});

//Edit Customer Details
app.post('/user/update', function(req, res){
	mysql_member_details.update_customer(req.param("user_id"),req.param("f_name"),req.param("l_name"),req.param("email"),req.param("street"),req.param("city"),req.param("state"),req.param("zipcode"));
	res.redirect(req.get('referer'));
});

