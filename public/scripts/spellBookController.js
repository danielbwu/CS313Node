app.controller('SpellBookController', ['SpellBookService', '$scope', '$http', function (SpellBookService, $scope, $http) {

    $scope.spells = [];

    //Initializes data
    $scope.init = function () {
        $scope.getAllSpells();
    };

    //Gets all spells
    $scope.getAllSpells = function () {
        SpellBookService.getAllSpells()
            .then(function (response) {
                console.log("Spells:", response.data);
                $scope.spells = response.data;
            })
            .catch(function (error) {
                console.error("Error retrieving spells", error.data);
            })
    };

    //Gets classes for a specific spell
    $scope.getClassesForSpell = function (spellId) {
        console.log("Getting classes for spell:", spellId);
    };
}]);