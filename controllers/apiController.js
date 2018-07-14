const { Pool } = require("pg");
const connectionString = process.env.DATABASE_URL || 'postgres://ordrrpumualgtc:c064fea68415861ee41a4e04d13fa7ba564c31840ecce3a157d7a3d52aa6ecec@ec2-184-73-199-189.compute-1.amazonaws.com:5432/dbp22j980k9d0c';
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

module.exports = {
    getSpells: getSpells,
    getClasses: getClasses,
    getSchools: getSchools
}