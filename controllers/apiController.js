const { Pool } = require("pg");
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({connectionString: connectionString});

//Gets player classes
function getClasses(req, res) {
    console.log("Retrieving classes");
    var qtext = "SELECT * FROM class";

    pool.query(qtext, function(err, result) {

      if (err) { throw err; }
  
      console.log("Back from db with result: ", result);
      res.status(200).json(result.rows);	
  
    });
    
}

//Gets schools of magic
function getSchools(req, res) {
    console.log("Retrieving schools");
    var qtext = "SELECT * FROM school";

    pool.query(qtext, function(err, result) {

      if (err) { throw err; }
  
      console.log("Back from db with result: ", result);
      res.status(200).json(result.rows);	
  
    });
}

//Gets spells
function getSpells(req, res) {
    console.log("Retrieving spells");
    var qtext = "SELECT * FROM spells";

    pool.query(qtext, function(err, result) {

      if (err) { throw err; }
  
      console.log("Back from db with result: ", result);
      res.status(200).json(result.rows);	
  
    });
}

//Adds a spell to the database
function addSpell(req, res) {
    console.log("Adding a new spell");
}

module.exports = {
    getSpells: getSpells,
    getClasses: getClasses,
    getSchools: getSchools,
    addSpell: addSpell
}