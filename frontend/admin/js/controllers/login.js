"use strict";

function loginController ($scope, $http, $state, Profile) {
    $scope.loginValidationRules = {
        rules: {
            email: {
                required: true,
                email: true
            },
            password: {
                required: true,
                minlength: 6
            }
        },
        messages: {
            email: {
                required: "We need your email address to contact you",
                email: "Your email address must be in the format of name@domain.com"
            },
            password: {
                required: "You must enter a password",
                minlength: "Your password must have a minimum length of 6 characters"
            }
        }
    };

    $scope.formData = {};

    $scope.login = function (form) {
        if (!form.validate()) {
            return false;
        }

        Profile.login($scope.formData)
            .then(function(user) {
                Profile.setAsCurrent(user);
                $state.go('default.users');
            })
    };
}

angular.module('CR_Template')
    .controller('loginController', loginController);
