/*
 * To handle movie details.
 * GET - Show specific movie details,
 * POST - Update movie, Delete movie, and Add to cart.
 */
var query = require('./dbConnectivity/mysqlQuery');
var cart = null;
var total = 0.00;

function handleCookieandPage(req, res, message, total) {
	res.cookie('cartCookie', '1', {maxAge: null, httpOnly: false, signed: true, cart: cart});
	console.log("cart>>>"+ JSON.stringify(cart));
	res.render('index', { title: 'A2Z', layout:false, locals: { username: req.session.username, message: message}});
}

exports.add = function(req, res) {
	var query = require('./dbConnectivity/mysqlQuery');
	console.log(req.param('m_id'));
	console.log(req.param('hidden_m_name'));
	console.log(req.param('hidden_rent_amount'));
	var params = [req.param('m_id')];

	var movie = {m_id: req.param('m_id'), m_name: req.param('hidden_m_name'), rent_amount: req.param('hidden_rent_amount')};

	if(cart === null) {
		cart = [];
		total = movie.rent_amount;
		cart[0] = movie;
		handleCookieandPage(req, res, "Movie added to bag!", total);
	} else {
		var alreadyAdded = false;
		for (var index = 0; index < cart.length; index++) {
			if ( movie.m_id === cart[index].m_id) {
				alreadyAdded = true;
				break;
			} else {
				console.log("movie rent amt:"+ movie.rent_amount);
				total = +total + +movie.rent_amount;
				console.log('total:'+total);
			}
		}
		if (alreadyAdded) {
			handleCookieandPage(req, res, "Movie is already in bag!", total);
		} else {
			cart[0].orderTotal = total;
			cart[cart.length] = movie;
			handleCookieandPage(req, res, "Movie added to bag!", total);
		}
	}
};
	exports.remove = function (req, res) {
		console.log("inside remove");
		var item2Remove = req.param('m_id');
		console.log(item2Remove);
		for (var index = 0; index < cart.length; index++) {
			if ( item2Remove === cart[index].m_id) {
				total = +total - +cart[index].rent_amount;
				for (var x = index; x < cart.length; x++) {
					cart[x] = cart[x+1];
				}
				cart.pop();
			}
		}
		res.cookie('cartCookie', '1', {maxAge: null, httpOnly: false, signed: true, cart: cart});
		console.log(' req.session.username:'+ req.session.username);
		res.render('viewCart', { title: 'Shopping Bag', username: req.session.username, cart: cart, message: null, total: total} );
	};

	exports.view = function (req, res) {
		console.log(' req.session.username:'+ req.session.username);
		res.render('viewCart', { title: 'Shopping Bag', username: req.session.username, cart: cart, message: null, total: total} );
	};


	//	query.execQuery(sqlStmt, params, function(err, rows) {
//	if(rows.length !== 0) {
//	try {
//	var movie = [];
//	var mQty;
//	if (rows[0].quantity <= 0) {
//	mQty = 'Sold Out';
//	console.log('>> Following movie is out of stock: '+ rows[0].m_id);
//	}
//	movie[0] = {
//	m_id : rows[0].m_id,
//	m_name : rows[0].m_name,
//	banner : rows[0].banner,
//	release_date : rows[0].release_date,
//	rent_amount : rows[0].rent_amount,
//	category : rows[0].category,
//	quantity : 0
//	};
//	console.log(movie[0].m_name);
//	res.render('movie-details', { title: rows[0].m_name, layout:false,	locals: { username : req.session.username, movie : movie, errorMessage: ""}});
//	} catch (e) {
//	console.log('Error>>'+e.message);
//	res.status = 500;
//	res.render('index', { titile: 'VLM', layout:false, locals: { username: req.session.username, message: 'Sorry! Something went wrong'}});
//	}
//	} else {
//	res.status = 500;
//	res.render('index', { titile: 'VLM', layout:false, locals: { username: req.session.username, message: 'Sorry! Something went wrong'}});
//	}
//	});

	function clearCart(req, res) {
		res.clearCookie('cartCookie');
		req.session = null;
		res.redirect('/');
	}
	/*
	 * 
	var query = require('./dbConnectivity/mysqlQuery');
	//connection.escape(userId) to avoid SQL Injection attacks
	var sqlStmt = "select count(*) as isValidLogin, last_login_ts as lastLoginTS from login_detail where user_id=? and password=?";
	var isLoggedIn = false;
	var lastLoginTS = null;
	var params = [req.param('email'), req.param('password')];
	query.execQuery(sqlStmt, params, function(err, rows) {
		console.log(rows);
		if(rows.length !== 0) {
			if (rows[0].isValidLogin === 1) {
				lastLoginTS = rows[0].lastLoginTS;
				req.session.username = req.param('email');
				req.session.isLoggedin = true;
				var backURL=req.header('Referer') || '/';
				console.log(backURL);
				if (backURL.indexOf('login', 0) === -1 && backURL.indexOf('register', 0) === -1) {
					res.statusCode = 302;
					res.redirect(backURL);
				} else {
					res.render('index', { titile: 'A2Z', layout:false, locals: { username: req.session.username, message: lastLoginTS}});
					sqlStmt = 'update login_detail set last_login_ts = ? where user_id = ?';
					params = [new Date(), req.param('email')];
					query.execQuery(sqlStmt, params, function(err, rows) {
						if (err) {
							console.log('Error in logging the time stamp');
						}
					});
				}
				isLoggedIn = true;
			} else {
				res.render('login', { title: 'Login', layout:false, locals: { errorMessage: "Invalid Login. Try again."}});
			}
		}
	});
	 */
	/*exports.registerCustomer = function (req, res) {
	var query = require('./dbConnectivity/mysqlQuery');
	//connection.escape(userId) to avoid SQL Injection attacks
	var sqlStmt = "insert into login_detail values(?,?,?,?,null)";
	var params = [req.param('fName'), req.param('lName'), req.param('email'), req.param('password')];
	query.execQuery(sqlStmt, params, function(err, rows) {
		if (!err) {
			console.log("DATA : "+JSON.stringify(rows));
			if(rows.length !== 0){
				res.render('login', { title: 'Login', layout:false, locals: { errorMessage: ""}});
			}
		} else {
			console.log("Error executing query");
			res.status = 500;
			res.render('register', {title: 'Register', layout:false, locals: { errorMessage: "Problem in registeration. Please try again with correct values!"}});
		}
	});
};
	 */