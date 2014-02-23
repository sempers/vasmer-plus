var http = require('http');
var express = require('express');
var search = require('./search');

var app = express();
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/public');
app.engine('html', require('ejs').renderFile);

var server = http.createServer(app);
var dbCrashed = false;

try {
    var db = require('dblite')("vasmer.sqlite");
}
catch (e) {
    dbCrashed = true;
}

app.get("/search/:word", function (req, res) {
    return search.searchWord(req, res, db);
});

app.get("/*", function (req, res) {
    if (dbCrashed)
        res.render("index-nodb.html");
    else
        res.render("index.html");
});

server.listen(process.env.PORT || 3000, process.env.IP || "127.0.0.1", function () {
    var addr = server.address();
    console.log("Server listening at ", addr.address + ":" + addr.port);
});