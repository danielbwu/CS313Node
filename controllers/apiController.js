const {Pool} = require('pg');
const pool = new Pool({
    user: 'ordrrpumualgtc',
    host: 'ec2-184-73-199-189.compute-1.amazonaws.com',
    database: 'dbp22j980k9d0c',
    password: 'c064fea68415861ee41a4e04d13fa7ba564c31840ecce3a157d7a3d52aa6ecec',
    port: 5432
});

//Gets spells
function getSpells(req, res) {
    console.log("Retrieving spells");
    res.send("Spells");
}

//Gets classes
function getClasses(req, res) {
    console.log("Retrieving classes");

    var text = "SELECT * FROM class"
    pool.query(text, (err, res) => {
        console.log(err, res);
        pool.end();
    });

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