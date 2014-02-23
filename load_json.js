var cheerio = require('cheerio');
var fs = require('fs');

var html = fs.readFileSync("vasmer-all.html", {encoding: "utf-8", flag: "r"});

console.log("Loading html");
var $ = cheerio.load(html);
console.log("Html loaded");

function mend(word) {
    return word.
        replace("я́", "я").
        replace("Я́", "я").
        replace("а́", "а").
        replace("А́", "А").
        replace("ы́", "ы").
        replace("Ы́", "Ы").
        replace("ю́", "ю").
        replace("Ю́", "Ю").
        replace("о́", "о").
        replace("О́", "О").
        replace("у́", "у").
        replace("У́", "У").
        replace("и́", "и").
        replace("И́", "И").
        replace("е́", "е").
        replace("Е́", "Е").
        replace("э́", "э").
        replace("Э́", "Э").
        trim();
}



var data = [];
var rows = $("table.results-table tr");

for (var j = 1; j<rows.length; j++) {
    var rec = {};
    var row = rows.eq(j);
    var tds = row.find("td");
    rec.word = mend(tds[0].children[0].children[0].children[0].data);
    rec.general = $(tds[1].children[0]).html();
    rec.origin = $(tds[2].children[0]).html();
    rec.trubachev = $(tds[3].children[0]).html();
    rec.langref = "";
    data.push(rec);
}

fs.writeFileSync("vasmer.json", JSON.stringify(data), {encoding: "utf-8"});
console.log(data.length, " records saved");