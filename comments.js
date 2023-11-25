// create web server
var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// set the view engine to ejs
app.set('view engine', 'ejs');

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));

// use res.render to load up an ejs view file

// index page
app.get('/', function (req, res) {
	res.render('pages/index');
});

// about page 
app.get('/about', function (req, res) {
	res.render('pages/about');
});

// contact page 
app.get('/contact', function (req, res) {
	res.render('pages/contact');
});

// add comment
app.post('/contact', urlencodedParser, function (req, res) {
	if (!req.body) return res.sendStatus(400);
	var comment = req.body;
	//console.log(comment);
	fs.appendFile('comments.txt', JSON.stringify(comment) + '\n', function (err) {
		if (err) {
			console.log(err);
			res.sendStatus(500);
		} else {
			res.redirect('/comments');
		}
	});
});

// show comments
app.get('/comments', function (req, res) {
	fs.readFile('comments.txt', function (err, data) {
		if (err) {
			console.log(err);
			res.sendStatus(500);
		} else {
			//console.log(data.toString());
			//res.send(data.toString());
			var comments = data.toString().split('\n');
			res.render('pages/comments', { comments: comments });
		}
	});
});

app.listen(8080);
console.log('8080 is the magic port');
