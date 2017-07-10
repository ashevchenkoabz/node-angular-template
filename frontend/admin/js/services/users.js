"use strict";

function UsersService (appConstants, $http) {
    function User () {
        this.url = appConstants.API_URL + 'users'
    }

    User.prototype.getList = function (filters) {
        return $http.get(this.url, {params: filters});
    };

    User.prototype.getOne = function (id) {
        return $http.get(this.url + '/' + id);
    };

    User.prototype.add = function (params) {
        return $http.post(this.url, params);
    };

    User.prototype.edit = function (id, params) {
        return $http.put(this.url + '/' + id, params);
    };

    User.prototype.delete = function (id) {
        return $http.delete(this.url + '/' + id);
    };

    return new User();
}

angular.module('CR_Template')
    .service('Users', UsersService);

