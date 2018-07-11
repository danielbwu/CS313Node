//Gets spells
function getSpells(req, res) {
    console.log("Retrieving spells");
    res.send("Spells");
}

//Gets classes
function getClasses(req, res) {
    console.log("Retrieving classes");
    res.send("Classes");
}

//Gets spell schools
function getSchools(req, res) {
    console.log("Retrieving schools");
    res.send("Schools");
}

module.exports = {
    getSpells: getSpells,
    getClasses: getClasses,
    getSchools: getSchools
}