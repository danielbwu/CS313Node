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

    $scope.classes = [
        {name: "Bard",
        id: 1,
        selected: false},
        {name: "Cleric",
        id: 2,
        selected: false},
        {name: "Druid",
        id: 3,
        selected: false},
        {name: "Paladin",
        id: 4,
        selected: false},
        {name: "Ranger",
        id: 5,
        selected: false},
        {name: "Sorcerer",
        id: 6,
        selected: false},
        {name: "Warlock",
        id: 7,
        selected: false},
        {name: "Wizard",
        id: 8,
        selected: false}
    ];

    $scope.init = function () {
        console.log("Hello World");
    };

    $scope.testText = "";

    //Adds a spell to the db
    $scope.addSpell = function () {
        if (confirm("Are you sure?")) {
            
            if ($scope.val_spell()) {
                console.log("Adding Spell");
                if (!$scope.spell.component_m) {
                    $scope.spell.component_desc = "";
                }
                console.log($scope.spell);

                var classes = $scope.classes.filter((x) => x.selected).map(y => y.id);
                console.log("Classes:", classes);

                AdminService.addSpell($scope.spell, classes)
                    .then(function (response) {
                        console.log("Response:", response);
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
                if (response.status == 200) {
                    alert("Successfully added spell!")
                } else {
                    alert("ERROR adding spell!")
                }
            })
            .catch(function (error) {
                console.error(error.data);
            });
    };

    $scope.showClasses = function () {
        var classes = $scope.classes.filter((x) => x.selected).map(y => y.id);
        console.log("Classes:", classes);
    };
}]);