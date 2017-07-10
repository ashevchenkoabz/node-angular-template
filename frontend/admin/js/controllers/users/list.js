"use strict";

function usersListController ($scope, Users, DataTable) {
    DataTable.initialize.call($scope, Users);
}

angular.module('CR_Template')
    .controller('usersListController',  usersListController);
