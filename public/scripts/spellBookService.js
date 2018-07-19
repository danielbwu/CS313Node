(function () {
    'use strict';

    app.service("SpellBookService", function ($http) {
        const baseurl = "https://morning-sea-17112.herokuapp.com/api/";
        //const baseurl = "../../api/";

        //Gets a list of all spells in the DB
        this.getAllSpells = function () {
            return $http.get(baseurl + "spells");
        };

        //Gets a list of all schools of magic
        this.getAllSchools = function () {
            return $http.get(baseurl + "schools");
        };

        //Gets a list of all player classes
        this.getAllClasses = function () {
            return $http.get(baseurl + "classes");
        };

        //Gets classes for a specific spell
        this.getClassesForSpell = function (spellId) {
            return $http.get(baseurl + "classes?spellId=" + spellId);
        };

        //Gets a spell by its id
        this.getSpellById = function (spellId) {
            return $http.get(baseurl + "spell?spellId=" + spellId);
        }

        //Gets a user's saved spells
        this.getUserSpells = function (userId) {
            return $http.post(baseurl + "user/spells");
        }
    });
})();