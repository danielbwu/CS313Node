const express = require('express')
const path = require('path')
const { Pool } = require("pg");
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({connectionString: connectionString});
var session = require('express-session');
const PORT = process.env.PORT || 5000;
const bodyParser = require('body-parser')


var apiController = require('./controllers/apiController.js');
const app = express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/hello', (req, res) => res.send('Hello World'))
  .get('/rates', (req, res) => res.render('pages/rates'))
  .get('/getRates', getRates)
  .get('/api/spells', apiController.getSpells)
  .get('/api/classes', apiController.getClasses)
  .get('/api/schools', apiController.getSchools)
  .post('/spells/add', apiController.addSpell)
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

// //Gets player classes
// function getClasses(req, res) {
//     console.log("Retrieving classes");
//     var qtext = "SELECT * FROM class";

//     pool.query(qtext, function(err, result) {

//       if (err) { throw err; }
  
//       console.log("Back from db with result: ", result);
//       res.status(200).json(result.rows);	
  
//     });
    
// }

// //Gets schools of magic
// function getSchools(req, res) {
//   console.log("Retrieving schools");
//     var qtext = "SELECT * FROM school";

//     pool.query(qtext, function(err, result) {

//       if (err) { throw err; }
  
//       console.log("Back from db with result: ", result);
//       res.status(200).json(result.rows);	
  
//     });
// }

// //Gets spells
// function getSpells(req, res) {
//   console.log("Retrieving spells");
//     var qtext = "SELECT * FROM spells";

//     pool.query(qtext, function(err, result) {

//       if (err) { throw err; }
  
//       console.log("Back from db with result: ", result);
//       res.status(200).json(result.rows);	
  
//     });
// }


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
    switch(parseInt(type)) {
      case 1: //Letters (stamped)
        console.log("Type: Letter (stamped)");
        switch(Math.ceil(weight)) {
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
        switch(Math.ceil(weight)) {
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
        switch(Math.ceil(weight)) {
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
        switch(Math.ceil(weight)) {
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
  res.render('pages/rateResults', {weight: weight, type: types[parseInt(type)], rate: rate.toFixed(2)});
}