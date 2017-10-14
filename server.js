const express = require('express');
const path = require('path');
const cons = require('consolidate');
const db = require('./db');

const app = express();
app.engine("html", cons.ejs);
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/public');
app.engine('html', require('ejs').renderFile);

app.get('/api/:entry', db.jsonWord);
app.get('/api/lang/:lang', db.jsonLang);
app.get('/lang/:lang', db.htmlLang);
app.get('/export', db.exportDictionary);
app.get('/process', db.processDictionary);
app.get("/:entry", db.htmlWord);


app.listen(process.env.PORT || 3000, () => console.log('Vasmer2 listening'));