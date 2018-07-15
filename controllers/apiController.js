const { Pool } = require("pg");
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString: connectionString });

//Gets player classes
function getClasses(req, res) {
    console.log("Retrieving classes");
    var qtext = "SELECT * FROM class";

    handleGet(req, res, qtext);
}

//Gets schools of magic
function getSchools(req, res) {
    console.log("Retrieving schools");
    var qtext = "SELECT * FROM school";

    handleGet(req, res, qtext);
}

//Gets spells
function getSpells(req, res) {
    console.log("Retrieving spells");
    var qtext = "SELECT * FROM spell";

    handleGet(req, res, qtext);
}

//Adds a spell to the database
function addSpell(req, res) {
    console.log("Adding a new spell");

    if (req.body.spell && req.body.classes) {
        if (validateSpell(req.body.spell)) {
            var spell = req.body.spell;
            var classes = req.body.classes;

            var qtext = "INSERT INTO spell(name, level, school_id, casting_time, target, range, component_v, component_s, component_m, component_desc, ritual, duration, concentration, description) " +
                "VALUES (" + processText(spell.name) + ", " + spell.level + ", " + spell.school_id + ", " + processText(spell.casting_time) + ", " + processText(spell.target) + ", " + processText(spell.range) + ", " + spell.component_v + ", " +
                spell.component_s + ", " + spell.component_m + ", " + processText(spell.component_desc) + ", " + spell.ritual + ", " + processText(spell.duration) + ", " + spell.concentration + ", " + processText(spell.description) + ") RETURNING id;";

            console.log("Adding spell:", spell);
            console.log("SQL Text", qtext);
            console.log("Classes", classes);
            //res.status(200).send(qtext);

            //Query Database
            console.log("Attempting to query DB");
            pool.query(qtext, function (err, result) {

                if (err) {
                    console.log("ERROR:", err);
                    res.status(500).json(err);
                } else {
                    console.log("Successfully added spell:", spell.name);
                    console.log(result);
                    var lastInsertId = result.rows[0].id;
                    console.log("Insert ID:", lastInsertId);
                    //linkClasses(lastInsertId, classes);
                    res.status(200).json(lastInsertId);
                }
            });

        } else {
            console.log("addSpell(): Invalid Spell");
            res.status(500).send("Invalid Spell");
        }
    } else {
        console.log("addSpell(): Missing body parameters");
        res.status(500).send("Invalid Spell");
    }
}

//Adds class relation to a spell
function linkClasses(spellId, classes) {
    for (i = 0; i < classes.length; i++) {
        let qtext = "INSERT INTO spell_class(spell_id, class_id) VALUES (" + spellId + ", " + classes[i] + ") RETURNING id;";
        console.log("Query:", qtext);

        //Query DB
        try {
            console.log("Attempting to link spell '", spellId, "' to class '", classes[i], "'");
            pool.query(qtext, function (err, result) {
                if (err) { 
                    console.log
                    throw err;
                } else {
                    console.log("Success")
                }
            });
        } catch(error) {
            console.error("Failed to create link");
            console.error(error);
        }
    }
}

function linkSpellToClass(req, res) {
    if (req.body.spellId && req.body.classId) {

    }
}

//Prepares text for DB INSERT
function processText(text) {
    if (text == "")
        return "null";
    else
        return "'" + text.replace("'", "''") + "'";
}

//Validates that required values are not null
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
    addSpell: addSpell,
    linkSpellToClass: linkSpellToClass
}