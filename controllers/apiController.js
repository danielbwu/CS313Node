const { Pool } = require("pg");
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString: connectionString });

//Gets player classes
function getClasses(req, res) {
    console.log("Retrieving classes");
    var qtext = "SELECT * FROM class";

    handleGet(req, res, qtext);
    // pool.query(qtext, function(err, result) {

    //   if (err) { throw err; }

    //   console.log("Back from db with result: ", result);
    //   res.status(200).json(result.rows);	

    // });

}

//Gets schools of magic
function getSchools(req, res) {
    console.log("Retrieving schools");
    var qtext = "SELECT * FROM school";

    handleGet(req, res, qtext);
    // pool.query(qtext, function(err, result) {

    //   if (err) { throw err; }

    //   console.log("Back from db with result: ", result);
    //   res.status(200).json(result.rows);	

    // });
}

//Gets spells
function getSpells(req, res) {
    console.log("Retrieving spells");
    var qtext = "SELECT * FROM spell";

    handleGet(req, res, qtext);
    // pool.query(qtext, function(err, result) {

    //   if (err) { throw err; }

    //   console.log("Back from db with result: ", result);
    //   res.status(200).json(result.rows);	

    // });
}

//Adds a spell to the database
function addSpell(req, res) {
    console.log("Adding a new spell");

    if (req.body.spell) {
        if (validateSpell(req.body.spell)) {
            var spell = req.body.spell;

            var qtext = "INSERT INTO spell(name, level, school_id, casting_time, target, range, component_v, component_s, component_m, component_desc, ritual, duration, concentration, description) " +
                "VALUES (" + processText(spell.name) + ", " + spell.level + ", " + spell.school_id + ", " + processText(spell.casting_time) + ", " + processText(spell.target) + ", " + processText(spell.range) + ", " + spell.component_v + ", " +
                spell.component_s + ", " + spell.component_m + ", " + processText(spell.component_desc) + ", " + spell.ritual + ", " + processText(spell.duration) + ", " + spell.concentration + ", " + processText(spell.description) + ");";

            console.log("Adding spell:", spell);
            console.log("SQL Text", qtext);
            res.send(qtext);
            //res.json(spell);
        }
    }
    //res.send("Add spell stub");
    res.end();
}

//Prepares text for DB INSERT
function processText(text) {
    if (text == "")
        return "null";
    else
        return "'" + text.replace("'", "''") + "'";
}

function validateSpell(spell) {

    return !(spell.name == null || spell.name == "" || spell.level == null
        || spell.school_id == null || spell.description == null || spell.description == "");
}

//Template for get request
function handleGet(req, res, qtext) {
    pool.query(qtext, function (err, result) {

        if (err) { res.status(500).json(err); }

        console.log("Back from db with result: ", result);
        res.status(200).json(result.rows);

    });
}

module.exports = {
    getSpells: getSpells,
    getClasses: getClasses,
    getSchools: getSchools,
    addSpell: addSpell
}