app.controller('SpellBookController', ['SpellBookService', '$scope', '$http', function (SpellBookService, $scope, $http) {

    $scope.spells = [];
    $scope.schools = [];
    $scope.classes = [];
    $scope.filterText = {
        name: "",
        // level: null,
        // school_id: null,
        // concentration: null,
        // ritual: null,
    }

    const levels = [
        "cantrip",
        "1st-level",
        "2nd-level",
        "3rd-level",
        "4th-level",
        "5th-level",
        "6th-level",
        "7th-level",
        "8th-level",
        "9th-level"];

    const schools = [
        "null",
        "abjuration",
        "conjuration",
        "divination",
        "enchantment",
        "evocation",
        "illusion",
        "necromancy",
        "transmutation"];

    //Initializes data
    $scope.init = function () {
        getAllSpells();

    };

    $scope.initUser = function () {
        console.log("Getting session details");
        $http.get('/session/details')
            .then(function (response) {
                $scope.session = response.data;
                console.log("Session", $scope.session);
                getUserSpells();
            })
            .catch(function (error) {
                console.error(error);
            })
    }

    //Gets all spells
    function getAllSpells() {
        SpellBookService.getAllSpells()
            .then(function (response) {
                console.log("Spells:", response.data);
                $scope.spells = response.data.sort(compare);
            })
            .catch(function (error) {
                console.error("Error retrieving spells", error.data);
            });
    }

    //Gets a user's saved spells
    function getUserSpells() {
        SpellBookService.getUserSpells()
            .then(function (response) {
                console.log(response.data);
                $scope.spells = response.data;
            })
            .catch(function (error) {
                console.error("Error retrieving spells", error.data);
            });
    }

    //Gets spell details
    $scope.getDetails = function (s) {
        var id = s.id;
        if (id) {
            if (s.description == null) {
                console.log("Getting details");
                SpellBookService.getSpellById(id)
                    .then(function (response) {
                        console.log(response.data[0]);
                        //$scope.details = response.data[0];
                        for (var x in response.data[0]) {
                            s[x] = response.data[0][x];
                        }
                        $scope.format(s.id, s.description);
                        $scope.getClassesForSpell(s);
                        //console.log("Updated details:", s);
                    })
                    .catch(function (error) {
                        console.error(error.data);
                    });
            }
        } else {
            console.error("No ID!");
        }
    };

    //Gets classes for a specific spell
    $scope.getClassesForSpell = function (spell) {

        console.log("Getting classes for spell:", spell.name);
        SpellBookService.getClassesForSpell(spell.id)
            .then(function (response) {
                console.log("Classes for ", spell.name, response.data);
                spell.classes = response.data;
                console.log(spell);
            })
            .catch(function (error) {
                console.error(error.data);
            });
    };

    //Formats text
    $scope.format = function (id, text) {
        // var node = document.createTextNode(text.replace(/\n/g, document.createElement("br")));
        // var span = document.createElement("span");
        // span.appendChild(node);
        // console.log("Span:", span);
        // return span;

        var split = text.split("\n");
        var span = document.createElement("span");

        for (i = 0; i < split.length; i++) {
            let node = document.createTextNode(split[i]);
            let br = document.createElement("br");
            span.appendChild(node);

            if (i < split.length - 1)
                span.appendChild(br);
        }

        var element = document.getElementById("desc" + id);
        element.appendChild(span);
    };

    //Translates level number to text
    $scope.level = function (level) {
        return levels[level];
    };

    //Translates school_id to text
    $scope.school = function (id) {
        return schools[id];
    }

    //Sorting function
    function compare(a, b) {
        if (a.level > b.level) { return 1; }
        if (a.level < b.level) { return -1; }
        if (a.name > b.name) { return 1; }
        if (a.name < b.name) { return -1; }
    }

    //Parses data from Express
    function htmlDecode(input) {
        var e = document.createElement('div');
        e.innerHTML = input;
        return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
    }

}]);