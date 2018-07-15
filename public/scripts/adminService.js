(function () {
    'use strict';

    app.service("AdminService", function ($http) {
        //const baseurl = "https://morning-sea-17112.herokuapp.com/api/";
        const baseurl = "../../api/";

        //Adds a spell to the DB
        this.addSpell = function (spell, classes) {
            let params = { spell: spell, classes: classes };
            return $http.post(baseurl + "spells/add", params);
        };

        this.postTest = function (text) {
            let params = { text: text };
            return $http.post("../../api/test", params);
        };
    });
})();