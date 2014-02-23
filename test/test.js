var cheerio = require('cheerio');
var fs = require('fs');

var html = fs.readFileSync("test.html", {encoding: "utf-8", flag: "r"});
//console.log(html);

var $ = cheerio.load(html);

var mdiv = $('div.results_record');
rec = {};

rec.word = mdiv.find("div span.unicode a").text();

var flds = mdiv.find("div span.unicode");
var flds_names = mdiv.find("div span.unicode").siblings("span.fld");
for (var i=1; i<flds.length; i++) {
    if (flds_names[i].children[0].data == "GENERAL:")
        rec.general = flds[i].children[0].data;
    else if (flds_names[i].children[0].data == "ORIGIN:")
        rec.origin = flds[i].children[0].data;
    else if (flds_names[i].children[0].data == "TRUBACHEV:")
        rec.trubachev = flds[i].children[0].data;
}
