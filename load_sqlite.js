var fs = require('fs');
var dblite = require('dblite');
var json;

function loadJSONToDb(data){

    var db = dblite("vasmer.sqlite");
    db.query("CREATE TABLE IF NOT EXISTS vasmer (id INTEGER PRIMARY KEY AUTOINCREMENT, word TEXT, general TEXT, origin TEXT, trubachev TEXT, langref VARCHAR);");
    db.query("DELETE from vasmer", function(err){

        var c = 0;

        function insertcb(){
            //console.log("Record #", this.index, " word: ", this.word, "inserted.");
            c++;
            if (c == data.length)
                console.log("import completed");
        }

        if (!err) {
            c = 0;
            for (var i=0; i<data.length; i++){
                var rec = data[i];
                rec.origin = rec.origin || "";
                rec.general = rec.general || "";
                rec.trubachev = rec.trubachev || "";
                rec.langref = rec.langref || "";
                rec.index = i;
                db.query("INSERT INTO vasmer (word, general, origin, trubachev, langref) VALUES ( :word, :general, :origin, :trubachev, :langref)", rec, insertcb);
            }
        }
    });
}


fs.readFile('vasmer.json', {encoding: 'utf8'}, function(err, data){
    if (!err) {
        json = JSON.parse(data);
        console.log("import started");
        loadJSONToDb(json);
    }
});

