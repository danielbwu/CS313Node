const { Pool } = require("pg");
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString: connectionString });

//Gets player classes
// Route: /api/classes
function getClasses(req, res) {
    console.log("Retrieving classes");

    try {
        //If spell is specified
        if (req.query.spellId) {
            getClassesForSpell(req, res);
        } else { //Get all classes
            var qtext = "SELECT * FROM class";
            handleGet(req, res, qtext);
        }
    } catch (error) {
        console.error("Failed to retrieve classes");
        console.error(err);
        res.status(500).send("Failed to retrieve classes");
    }
}

//Gets schools of magic
// Route: /api/schools
function getSchools(req, res) {
    console.log("Retrieving schools");
    var qtext = "SELECT * FROM school";

    try {
        handleGet(req, res, qtext);
    } catch (error) {
        console.error("Failed to retrieve schools");
        console.error(err);
        res.status(500).send("Failed to retrieve schools");
    }
}

//Gets spells
// Route: /api/spells/all
function getSpells(req, res) {
    console.log("Retrieving spells");
    var qtext = "SELECT * FROM spell";

    try {
        handleGet(req, res, qtext);
    } catch (error) {
        console.error("Failed to retrieve spells");
        console.error(err);
        res.status(500).send("Failed to retrieve spells");
    }
}

//Gets names, ids and levels of spells
// Route: /api/spells
function getSpellsMin(req, res) {
    console.log("Retrieving spells (min)");
    var qtext = "SELECT id, name, level FROM spell";

    try {
        handleGet(req, res, qtext);
    } catch (error) {
        console.error("Failed to retrieve spells");
        console.error(err);
        res.status(500).send("Failed to retrieve spells");
    }
}

//Get a specific spell by id
// Route: /api/spell?spellId={spellId}
function getSpellById(req, res) {
    console.log("api called: getSpellById()")
    if (req.query.spellId) {
        try {
            //Parse query for spell id
            let spellId = parseInt(req.query.spellId);
            if (spellId == null) {
                throw new error("Invalid spell id");
            } else {
                console.log("Getting details for spell:", spellId);
                //Query DB
                var qtext = "SELECT * FROM spell WHERE id =" + spellId + ";";
                handleGet(req, res, qtext);
            }
        } catch (error) {
            console.error("Failed to retrieve spell details");
            console.error(err);
            res.status(500).send("Failed to retrieve spell details");
        }
    } else {
        console.log("getSpellById(): Missing query parameter");
        res.status(400).send("Spell ID not specified");
    }
}

//Gets classes associated with a specific spell id
// Called by getClasses
// Route: /api/classes?spellId={id}
function getClassesForSpell(req, res) {
    if (req.query.spellId) {
        //Parse query for spell id
        let spellId = parseInt(req.query.spellId);
        if (spellId == null) {
            throw new error("Invalid spell id");
        } else {
            console.log("Getting classes for spell:", spellId);
            //Query DB
            var qtext = "SELECT sc.id, sc.class_id, c.name FROM class AS c JOIN spell_class AS sc ON sc.class_id=c.id WHERE sc.spell_id=" + spellId + ";";
            handleGet(req, res, qtext);
        }
    } else {
        console.log("getClassesForSpell(): Missing query parameter");
        res.status(400).send("Spell ID not specified");
    }
}

//Gets spells associated with a specific class id
function getSpellsForClass(req, res) {
    var stubText = "Stub: getSpellsForClass()";
    console.log(stubText);
    res.send(stubText);
}

//Gets spells associated with a specific class id
function getSpellsForSchool(req, res) {
    var stubText = "Stub: getSpellsForSchool()";
    console.log(stubText);
    res.send(stubText);
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
            console.log("SQL Text:", qtext);
            console.log("Classes:", classes);
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
                    linkClasses(lastInsertId, classes);
                    res.status(200).json(lastInsertId);
                }
            });

        } else {
            console.log("addSpell(): Invalid Spell");
            res.status(500).send("Invalid Spell");
        }
    } else {
        console.log("addSpell(): Missing body parameters");
        res.status(400).send("Invalid Spell");
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
                    console.log(err);
                    throw err;
                } else {
                    console.log("Success");
                }
            });
        } catch (error) {
            console.error("Failed to create link");
            console.error(error);
        }
    }
}

//Creates a single link between a spell and class
function linkSpellToClass(req, res) {
    console.log("Linking spell to class");
    if (req.body.spellId && req.body.classId) {
        let spellId = req.body.spellId;
        let classId = req.body.classId;
        let qtext = "INSERT INTO spell_class(spell_id, class_id) VALUES (" + spellId + ", " + classId + ") RETURNING id;";
        console.log("Query:", qtext);

        //Query DB
        try {
            console.log("Attempting to link spell '", spellId, "' to class '", classId, "'");
            pool.query(qtext, function (err, result) {
                if (err) {
                    console.log(err);
                    throw err;
                } else {
                    console.log("Success");
                    var lastInsertId = result.rows[0].id;
                    console.log("Insert ID:", lastInsertId);
                    res.status(200).json(lastInsertId);
                }
            });
        } catch (error) {
            console.error("Failed to create link");
            console.error(error);
        }
    } else {
        console.log("linkSpellToClass(): Missing body parameters");
        res.status(400).send("Bad request");
    }
}

//Prepares text for DB INSERT
function processText(text) {
    if (text == "")
        return "null";
    else
        return "'" + text.replace(/'/g, "''") + "'";
}

//Validates that required values are not null
function validateSpell(spell) {

    return !(spell.name == null || spell.name == "" || spell.level == null
        || spell.school_id == null || spell.description == null || spell.description == "");
}

//Template for get request
function handleGet(req, res, qtext) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    pool.query(qtext, function (err, result) {

        //Throw error
        if (err) { throw err; }

        //Success
        console.log("Back from db with result: ", result);
        res.status(200).json(result.rows);

    });
}

/*************************************** 
* Account Stuff
****************************************/
//Creates a new user account
function createUser(req, res) {
    // var stubText = "Stub: createUser()";
    // console.log(stubText);
    // res.send(stubText);

    if (req.body.username && req.body.password) {
        try {
            existsAccount(req.body.username, function (err, exists, result) {
                if (!exists) {
                    let username = req.body.username;
                    let pass = req.body.password;
                    let qtext = "INSERT INTO account(username, password) VALUES (" + processText(username) + ", " + processText(pass) + ");";
                    console.log("Query:", qtext);
                    pool.query(qtext, function(err, response) {
                        if (err) { throw err; }
                        else {
                            console.log("Successfully created new account");
                            res.send("Success!");
                        }
                    })
                } else {
                    console.log("User already exists");
                    res.send("User already exists!");
                }
            })
        } catch (error) {
            console.error("Error creating new user");
            console.error(error);
        }
    } else {
        console.log("createUser(): Missing body parameters");
        res.status(400).send("Bad request");
    }
}

//Logs a user in
function login(req, res) {
    // var stubText = "Stub: login())";
    // console.log(stubText);
    // res.send(stubText);

    if (req.body.username && req.body.password) {
        let username = req.body.username;
        let pass = req.body.password;
        console.log("Username:", username);
        console.log("Password:", pass);

        existsAccount(req.body.username, function (err, exists, result) {
            if (exists) {
                console.log("Loggin in");
                console.log("Sent:  ", pass);
                console.log("Actual:", result.rows[0].password);
                if (pass === result.rows[0].password) {
                    console.log("Password match");
                    res.send("Password match");
                } else {
                    console.log("No match");
                    res.send("Invalid username or password");
                }
            }
        })
    }
}

//Logs a user out
function logout(req, res) {
    var stubText = "Stub: logout())";
    console.log(stubText);
    res.send(stubText);
}

//Deletes a user account
function deleteUser(req, res) {
    var stubText = "Stub: deleteUser()";
    console.log(stubText);
    res.send(stubText);
}

//Adds a spell to a user's saved list
function addSpellToAccount(req, res) {
    var stubText = "Stub: addSpellToAccount()";
    console.log(stubText);
    res.send(stubText);
}

//Adds a spell to a user's saved list
function removeSpellFromAccount(req, res) {
    var stubText = "Stub: removeSpellFromAccount()";
    console.log(stubText);
    res.send(stubText);
}

//Checks if an account already exists
function existsAccount(username, callBack) {
    let qtext = "SELECT * FROM account WHERE username=" + processText(username) + ";";
    pool.query(qtext, function (err, result) {

        //Throw error
        if (err) { throw err; }

        //Success
        console.log("Back from db with result: ", result);

        var exists = result.rowCount > 0;
        console.log("Account exists:", exists);

        callBack(err, exists, result);
    });
}

module.exports = {
    getSpells: getSpells,
    getClasses: getClasses,
    getSchools: getSchools,
    addSpell: addSpell,
    linkSpellToClass: linkSpellToClass,
    getSpellById: getSpellById,
    getSpellsForClass: getSpellsForClass,
    getSpellsForSchool: getSpellsForSchool,
    createUser: createUser,
    login: login,
    logout: logout,
    deleteUser: deleteUser,
    addSpellToAccount: addSpellToAccount,
    removeSpellFromAccount: removeSpellFromAccount,
    getSpellsMin: getSpellsMin
}