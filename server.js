var http = require('http');
var express = require('express');
var search = require('./search');

var app = express();
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/public');
app.engine('html', require('ejs').renderFile);
app.use(express.methodOverride());
app.set('port', process.env.PORT || 3000);

var dbCrashed = true;
var db;

/*
try {
    var dblite = require('dblite');
    db = dblite("vasmer.sqlite");
}
catch (e)
{
	dbCrashed = true;
}*/

app.get("/search/:word", function(req, res){
    return search.searchWord(req, res, db);
});

app.get("/*", function (req, res) {
	if (dbCrashed)
		res.render("index-nodb.html");
	else 
		res.render("index.html");
});

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});