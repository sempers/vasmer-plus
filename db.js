const mongoose = require('mongoose');
const util = require('util');
const DB_URI = 'mongodb://ds147974.mlab.com:47974/vasmer';
const fs = require('fs');

mongoose.connection.on('connected', () => console.log('Mongoose connected to ' + DB_URI));
mongoose.connection.on('error', (err) => console.log('Mongoose connection error: ' + err));
mongoose.connection.on('disconnected', () => console.log('Mongoose disconnected'));

mongoose.connect(DB_URI, {user: 'smart_rookie', pass: '12345'});

const Word = mongoose.model('Word',
    new mongoose.Schema({
        entry: String,
        entryUtf: String,
        general: String,
        origin: String,
        trubachev: String,
        langRefs: [String],
        wordRefs: [String]
    }), 'words');

function exportDictionary() {
    const json = JSON.parse(fs.readFileSync('./vasmer.json', {encoding: 'utf8'}));
    var counter = 0;
    for (let i = 0; i < json.length; i++) {
        let word = json[i];
        Word.findOneAndUpdate(
            {entry: word.word},
            {
                entry: word.word,
                entryUtf: word.wordDict,
                general: word.general,
                origin: word.origin,
                trubachev: word.trubachev,
                langRefs: [],
                wordRefs: []
            },
            {'upsert': true},
            (err) => {
                if (err) {
                    console.log("[DB ERROR] " + util.inspect(err));
                } else {
                    counter++;
                }
            }
        )
    }
}

const LENGTH = 17216;
const LANGS = {
    'и.-е.': 'PraIndoEuropean',
    'др.-русск.': 'OldRussian',
    'цслав.': 'OldChurchSlavonic',
    'праслав.': 'Praslavic',
    'греч.': 'Greek',
    'лат.': 'Latin',
    'др.-инд.': 'Sanskrit',
    'авест.': 'Avestian',
    'польск.': 'Polish',
    'др.-польск.': 'OldPolish',
    'чеш.': 'Czech',
    'др.-чеш.': 'OldCzech',
    'слвц.': 'Slovakian',
    'лит.': 'Lithuanian',
    'гот.': 'Gothic',
    'д.-в.-н.': 'OldHighGerman',
    'лтш.': 'Latvian',
    'др.-ирл.': 'OldIrish',
    'др.-исл.': 'OldIcelandic',
    'др.-англ.': 'OldEnglish',
    'арм.': 'Armenian',
    'перс.': 'Persian',
    'тюркск.': 'Turkic',
    'тур.': 'Turkish',
    'англ.': 'English',
    'фр.': 'French',
    'ит.': 'Italian',
    'голл.': 'Hollandic',
    'осет.': 'Ossetic'
};


function processDictionary(req, res) {
    Word.find({}).stream()
        .on('data', (doc) => {
            doc = doc.toObject();
            var updated = false;

            function replaceLangLink(field, lang, code) {
                let _s = ' ' + doc[field] + ' ';
                let re = new RegExp('\\s' + lang.replace(/\./g, '\\.') + '\\s', 'gi');
                let newValue = _s.replace(re, ` <a class="langref" href="/lang/${code}">${lang}</a> `).trim();
                if (doc[field] != newValue) {
                    updated = true;
                    doc[field] = newValue;
                    if (doc.langRefs.indexOf(code)<0)
                        doc.langRefs.push(code);
                }
            }

            Object.keys(LANGS).forEach((lang) => {
                let code = LANGS[lang];
                replaceLangLink('general', lang, code);
                replaceLangLink('origin', lang, code);
                replaceLangLink('trubachev', lang, code);
            });

            if (updated) {
                Word.findOneAndUpdate({entry: doc.entry}, doc, {'upsert': true})
                    .exec((err) => {
                        if (err)
                            console.log(util.inspect(err));
                        else
                            console.log(`Word ${doc.entry} was updated, langRefs: ${doc.langRefs}`);
                    });
            }
        })
        .on('error', (err) => console.log(util.inspect(err)))
        .on('end', () => res.status(200).end('OK!'));
}

function jsonWord(req, res) {
    const entry = req.params.entry;
    if (!entry) {
        res.json([]);
        return;
    }
    const re = new RegExp('^-?' + entry, "i");
    Word.find({entry: re}).exec((err, words) => res.json(words.map((w) => w.toObject())));
}

function htmlWord(req, res) {
    const entry = req.params.entry;
    if (!entry) {
        res.render('index', {words: []});
        return;
    }
    const re = new RegExp('^-?' + entry, "i");
    Word.find({entry: re}).sort({entry: 1}).exec((err, words) => {
        if (!err) {
            res.render('index', {words: words.map((w) => w.toObject())});
        } else {
            res.render('index', {words: []});
        }
    });
}

function jsonLang(req, res) {
    var lang = req.params.lang;
    if (!lang || Object.values(LANGS).indexOf(lang) < 0) {
        res.json([]);
        return;
    }
    Word.find({langRefs: {'$in': [lang]}}).sort({entry: 1}).exec((err, words) => {
        if (!err) {
            res.json(words.map((w) => w.toObject()));
        } else {
            res.json([]);
        }
    });
}

function htmlLang(req, res) {
    var lang = req.params.lang;
    if (!lang || Object.values(LANGS).indexOf(lang) < 0) {
        res.render('index', {words: []});
        return;
    }
    Word.find({langRefs: {'$in': [lang]}}).sort({entry: 1}).exec((err, words) => {
        if (!err) {
            res.render('index', {words: words.map((w) => w.toObject())});
        } else {
            res.render('index', {words: []});
        }
    });
}

module.exports = {exportDictionary, jsonWord, htmlWord, processDictionary, htmlLang, jsonLang};