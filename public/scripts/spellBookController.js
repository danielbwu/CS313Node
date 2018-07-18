app.controller('SpellBookController', ['SpellBookService', '$scope', '$http', function (SpellBookService, $scope, $http) {

    $scope.spells = [];
    $scope.schools = [];
    $scope.classes = [];
    $scope.details = { id: null };

    //Initializes data
    $scope.init = function () {
        getAllSpells();
    };

    //Gets all spells
    function getAllSpells() {
        SpellBookService.getAllSpells()
            .then(function (response) {
                console.log("Spells:", response.data);
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
            if ($scope.details.id == null || $scope.details.id != id) {
                console.log("Getting details");
                SpellBookService.getSpellById(id)
                    .then(function (response) {
                        console.log(response.data[0]);
                        $scope.details = response.data[0];
                        for (var x in response.data[0]) {
                            s[x] = response.data[0][x];
                        }
                        
                        console.log("Updated details:", s);
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
        // if (false) {
        //     console.log("Getting classes for spell:", spell.name);

        //     SpellBookService.getClassesForSpell(spell.id)
        //         .then(function (response) {
        //             console.log("Classes for ", spell.name, response.data);
        //             spell.classes = response.data;
        //         })
        //         .catch(function (error) {
        //             console.error(error.data);
        //         });
        // } else {
        //     console.log("Classes already retrieved");
        // }
        console.log("Stub");
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

        for (i = 0; i < res.length; i++) {
            let node = document.createTextNode(split[i]);
            let br = document.createElement("br");
            span.appendChild(node);
            span.appendChild(br);
        }

        var element = document.getElementById("desc" + id);
        //var child = document.getElementById("demo");
        element.appendChild(span);
    };
}]);