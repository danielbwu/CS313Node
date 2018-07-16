app.controller('SpellBookController', ['SpellBookService', '$scope', '$http', function (SpellBookService, $scope, $http) {

    $scope.spells = [];
    $scope.schools = [];
    $scope.classes = [];
    $scope.details = {};

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
    $scope.getDetails = function (id) {
        if ($scope.details.id != id) {
            SpellBookService.getSpellById(id)
                .then(function (response) {
                    console.log(response.data);
                    $scope.details = response.data;
                })
                .catch(function (error) {

                });
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
}]);