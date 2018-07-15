app.controller('AdminController', ['AdminService', '$scope', '$http', function (AdminService, $scope, $http) {
    
    $scope.spell = {
        name: "",
        level: 0,
        school_id: 0,
        casting_time: "",
        target: "",
        range: "",
        component_v: false,
        component_s: false,
        component_m: false,
        component_desc: "",
        ritual: false,
        duration: "",
        concentration: false,
        description: ""
    };

    $scope.init = function () {
        console.log("Hello World");
    };

    $scope.testText = "";

    //Adds a spell to the db
    $scope.addSpell = function () {
        if (confirm("Are you sure?")) {
            
            if ($scope.val_spell()) {
                console.log("Adding Spell");
                console.log($scope.spell);

                AdminService.addSpell($scope.spell)
                    .then(function (response) {
                        console.log("Response:", response.data);
                    })
                    .catch(function (error) {
                        console.error(error);
                    });

            } else {
                console.error("Invalid spell");
            }
        }
        
    };

    $scope.val_spell = function () {
        // if ($scope.spell.name == null || $scope.spell.name == "")
        //     return false;
        // if ($scope.spell.level == null)

        return !($scope.spell.name == null || $scope.spell.name == "" || $scope.spell.level == null
            || $scope.spell.school_id == null || $scope.spell.description == null || $scope.spell.description == "");
    }

    $scope.postTest = function () {
        console.log("Testing POST:", $scope.testText);
        AdminService.postTest($scope.testText)
            .then(function (response) {
                console.log(response.data);
            })
            .catch(function (error) {
                console.error(error.data);
            });
    };
}]);