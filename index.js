const express = require('express');
const path = require('path');

const { Pool } = require("pg");
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString: connectionString });

var session = require('express-session');
const PORT = process.env.PORT || 5000;
var bodyParser = require('body-parser');

const bcrypt = require('bcrypt');
const saltRounds = 10;
//const salt = bcrypt.genSalt(saltRounds);

var apiController = require('./controllers/apiController.js');
const app = express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(session({
    secret: 'placeholder-secret',
    resave: false,
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
    saveUninitialized: true
  }))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', home)
  .get('/SpellBook/Spells', home)
  .get('/hello', (req, res) => res.send('Hello World'))
  .get('/rates', (req, res) => res.render('pages/rates'))
  .get('/getRates', getRates)
  .get('/Spells', searchSpells)
  .get('/MySpells', verifyLogin, mySpells)
  .get('/login', login)
  .get('/logout', logout)
  .get('/signup', signup)
  .get('/Admin/AddSpell', verifyAdmin, adminAddSpell)
  .get('/api/spell', apiController.getSpellById)
  .get('/api/spells/all', apiController.getSpells)
  .get('/api/spells', apiController.getSpellsMin)
  .get('/api/classes', apiController.getClasses)
  .get('/api/schools', apiController.getSchools)
  .post('/api/spells/add', verifyAdmin, apiController.addSpell)
  .post('/api/spell/class/link', verifyAdmin, apiController.linkSpellToClass)
  .post('/api/users/create', hash, apiController.createUser)
  .post('/api/users/login', apiController.login)
  .post('/api/users/delete', verifyUserDelete, apiController.deleteUser)
  .post('/api/user/spell/add', verifyLogin, apiController.addSpellToAccount)
  .post('/api/user/spell/remove', verifyLogin, apiController.removeSpellFromAccount)
  .listen(PORT, () => console.log(`Listening on ${PORT}`));


//Redirects to home page
function home(req, res) {
  res.writeHead(301, { Location: "/Spells" });
  res.end();
}

//View all spells
function searchSpells(req, res) {
  res.render('pages/searchSpells', {session: req.session});
}

//Show user's saved spells
function mySpells(req, res) {
  res.send(req.session.user);
}

//Verifies user login
function verifyLogin(req, res, next) {
  console.log("Verifying login...");
  if (req.session.user) {
    next();
  } else {
    res.writeHead(301, { Location: "/login" });
    res.end();
  }
  next();
}

//Verifies admin login
function verifyAdmin(req, res, next) {
  console.log("Verifying Admin...");
  next();
}

//Directs to admin spell add form
function adminAddSpell(req, res) {
  res.render('pages/addSpellForm', {session: req.session});
}

//Directs to login page
function login(req, res) {
  res.render('pages/login', {session: req.session});
}

//Directs to signup page
function signup(req, res) {
  res.render('pages/signup', {session: req.session});
}

//Middleware for deleteing user
function verifyUserDelete(req, res, next) {
  console.log("Verifying User Delete");
  next();
}

//Logs a user out
function logout(req, res) {
  req.session.destroy();
  res.writeHead(301, { Location: "/Spells" });
  res.end();
}

//Hashes password
function hash(req, res, next) {
  if (req.body.username && req.body.password) {
    try {
      //Hash password
      bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash(req.body.password, salt, function (err, hash) {
          // Store hash in your password DB.
          if (err) { throw err; }
          else {
            req.body.password = hash;
            // res.json({username: req.body.username, password: req.body.password,
            // hash: hash, passwordConfirm: req.body.passwordConfirm});
            next();
          }
        });
      });

    } catch (error) {
      console.error("Error creating new user");
      console.error(error);
    }
  } else {
    console.log("createUser(): Missing body parameters");
    res.status(400).send("Bad request");
  }
}

//Tests post 
function postTest(req, res) {
  //if (req)
  console.log("Testing POST");
  console.log("Message:", req.body.text);

  res.json(req.body);
}

function getRates(req, res) {
  var weight = req.query.weight;
  var type = req.query.type;
  var rate = 0;
  console.log("Weight:", weight);
  console.log("Type:", type);

  if (weight) {
    console.log("Weight:", weight);
    console.log("Weight (ceil):", Math.ceil(weight));
  } else {

  }

  if (type) {
    console.log("Type:", type);
  } else {

  }

  //Determine rate by type, then weight
  if (weight && type) {
    switch (parseInt(type)) {
      case 1: //Letters (stamped)
        console.log("Type: Letter (stamped)");
        switch (Math.ceil(weight)) {
          case 1:
            rate = 0.5;
            break;
          case 2:
            rate = 0.71;
            break;
          case 3:
            rate = 0.92;
            break;
          case 4:
            rate = 1.13;
            break;
          default:
            rate = 0;
        }
        break;

      case 2: //Letters (metered)
        console.log("Type: Letters (metered)");
        switch (Math.ceil(weight)) {
          case 1:
            rate = 0.47;
            break;
          case 2:
            rate = 0.68;
            break;
          case 3:
            rate = 0.89;
            break;
          case 4:
            rate = 1.10;
            break;
          default:
            rate = 0;
        }
        break;

      case 3: //Large Envelopes (flats)
        console.log("Type: Large Envelopes (flats)");
        switch (Math.ceil(weight)) {
          case 1:
            rate = 1.00;
            break;
          case 2:
            rate = 1.21;
            break;
          case 3:
            rate = 1.42;
            break;
          case 4:
            rate = 1.63;
            break;
          case 5:
            rate = 1.84;
            break;
          case 6:
            rate = 2.05;
            break;
          case 7:
            rate = 2.26;
            break;
          case 8:
            rate = 2.47;
            break;
          case 9:
            rate = 2.68;
            break;
          case 10:
            rate = 2.89;
            break;
          case 11:
            rate = 3.10;
            break;
          case 12:
            rate = 3.31;
            break;
          case 13:
            rate = 3.52;
            break;
          default:
            rate = 0;
        }
        break;

      case 4: //First-Class Package Service - Retail
        console.log("Type: First-Class Package Service - Retail");
        switch (Math.ceil(weight)) {
          case 1:
          case 2:
          case 3:
          case 4:
            rate = 3.50;
            break;
          case 5:
          case 6:
          case 7:
          case 8:
            rate = 3.75;
            break;
          case 9:
            rate = 4.10;
            break;
          case 10:
            rate = 4.45;
            break;
          case 11:
            rate = 4.80;
            break;
          case 12:
            rate = 5.15;
            break;
          case 13:
            rate = 5.50;
            break;
          default:
            rate = 0;
        }
        break;

      default:
        console.log("Type: Default");
        rate = 0;
    }
  }

  let types = ["", "Letter (Stamped)", "Letter (Metered)",
    "Large Envelope (Flats)", "First-Class Package Service—Retail"]
  console.log("Rate:", rate);
  //res.set('Content-Type', 'application/javascript');
  res.render('pages/rateResults', { weight: weight, type: types[parseInt(type)], rate: rate.toFixed(2) });
}