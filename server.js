var express = require('express');
var code = require('./code');

var app = express();
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/public');
app.engine('html', require('ejs').renderFile);

var db = code.dbConnect();

app.get("/q/:word", function(req, res){
    return code.searchWord(req, res, db);
});

app.get("/*", function (req, res) {
	res.render(db? "index.html": "index-nodb.html");
});

app.listen(process.env.PORT || 3000, function(){
	console.log('Vasmer listening');
});