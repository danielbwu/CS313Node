(function () {
    'use strict';

    app.service("AdminService", function ($http) {
        const baseurl = "https://morning-sea-17112.herokuapp.com/api/";
        //const baseurl = "";

        //Adds a spell to the DB
        this.addSpell = function (spell) {
            $http.post(baseurl + "/spell/add", spell);
        }
    });
})();