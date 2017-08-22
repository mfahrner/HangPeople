// required stuff
const express = require('express');
const app = express();
const mustache = require('mustache-express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const session = require('express-session');
const logic = require('./logic/logic');

// setting up the things
app.engine('mustache', mustache());
app.set('views', './views');
app.set('view engine', 'mustache');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'yamama',
  resave: false,
  saveUninitialized: true
}));


// global stuff for resetting
const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");

const possGuess = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
                    'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x',
                    'y', 'z'];

let numberOfGuesses = 8;


app.get('/', function (req, res) {
  if (!req.session.word) {
    req.session.possibleGuesses = possGuess;
    req.session.word = words[Math.floor(Math.random() * words.length)];
    req.session.remainingGuess = numberOfGuesses;
    req.session.guesses = [];
    req.session.displayWord = logic.underScore(req.session.word);
    req.session.winner = false;
  }
  console.log(req.session.word);
  res.render('index', {underScored: req.session.displayWord,
                        invalid: req.session.invalidGuess,
                        remaining: req.session.remainingGuess,
                        notGuessed: req.session.possibleGuesses,
                        duplicate: req.session.duplicate,
                        winner: req.session.winner});
 });

app.post('/', function (req, res) {
  if (req.body.guess.length > 1) {
    req.session.invalidGuess = true;
    res.redirect('/')
  }
  else {
    req.session.duplicate = logic.duplicate(req.body.guess, req.session.guesses);

    if (!req.session.duplicate) {
      req.session.guesses.push(req.body.guess.toLowerCase());
      let obj = logic.check(req.body.guess, req.session.word, req.session.displayWord, req.session.remainingGuess);
      req.session.displayWord = obj.display;
      req.session.possibleGuesses = logic.remove(req.body.guess, req.session.possibleGuesses);
      req.session.remainingGuess = obj.remainingGuesses;
    }

    if (req.session.displayWord.indexOf('_') === -1 && req.session.remainingGuess > 0) {
      req.session.winner = true;
    }

    res.redirect('/');
  }
});

app.post('/newGame', function (req, res) {
  req.session.word = '';
  res.redirect('/')
});



app.listen(3000, function () {
  console.log('Successfully started express application!')
});
