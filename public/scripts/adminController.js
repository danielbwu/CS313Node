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

    //Adds a spell to the db
    $scope.addSpell = function () {
        if (confirm("Are you sure?")) {
            console.log("Adding Spell");
            console.log($scope.spell);
        }
        
    };

    $scope.val_name = function () {
        console.log($scope.name != null && spell.name != "");
        return $scope.name != null && spell.name != "";
    }
}]);