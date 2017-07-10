"use strict";

function usersEditController ($scope, Users, $state) {
    var rulesWithPasword = {
        rules: {
            email: {
                required: true,
                email: true
            },
            name: {
                required: true
            },
            password: {
                required: true,
                minlength: 6
            },
            repeat_password: {
                required: true,
                minlength: 6,
                equalTo: "#password"
            }
        }
    };

    var rulesWithoutPasword = {
        rules: {
            email: {
                required: true,
                email: true
            },
            name: {
                required: true
            }
        }
    };

    $scope.userData = {
        email: '',
        name: '',
        password: '',
        repeat_password: '',
    };


    $scope.userValidationRules = rulesWithPasword;
    $scope.action = 'create';
    $scope.passwordChange = true;
    if ($state.params.id) {
        $scope.action = 'edit';
        $scope.passwordChange = false;
        $scope.userValidationRules = rulesWithoutPasword;

        Users.getOne($state.params.id)
            .success(function (data) {
                $scope.userData.email = data.email;
                $scope.userData.name = data.name;
            });
    }

    $scope.showPwdForm = function (e) {
        e.preventDefault();
        $scope.passwordChange = !$scope.passwordChange;
        $scope.userValidationRules = $scope.passwordChange ? rulesWithPasword : rulesWithoutPasword;
    };

    $scope.submit = function (form) {
        if (!form.validate()) {
            return false;
        }

        var method = $scope.action == 'create' ? 'add' : 'edit';
        var args = $scope.action == 'create' ? [$scope.userData] : [$state.params.id, $scope.userData];
        if (!$scope.passwordChange) {
            delete $scope.userData.password;
            delete $scope.userData.repeat_password;
        }

        Users[method].apply(Users, args)
            .success(function (data) {
                $state.go('default.users');
            })
    };

}

angular.module('CR_Template')
    .controller('usersEditController',  usersEditController);
