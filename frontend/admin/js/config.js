function config($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $locationProvider, $urlMatcherFactoryProvider, $validatorProvider, $httpProvider) {
    $urlMatcherFactoryProvider.strictMode(false);
    $urlRouterProvider.otherwise("/404");

    $ocLazyLoadProvider.config({
        // Set to true if you want to see what and when is dynamically loaded
        debug: true
    });

    $locationProvider.html5Mode(true);

    $stateProvider
        .state('login', {
            url: "/login",
            templateUrl: "login.html",
            data: { pageTitle: 'Login', specialClass: 'gray-bg' },
            controller: loginController
        })
        .state('default', {
            url: "/",
            templateUrl: "views/common/content.html",
            redirectTo: 'default.users',
            data: { pageTitle: 'Users '}
        })
        .state('default.users', {
            url: "users",
            templateUrl: "views/users/list.html",
            controller: usersListController
        })
        .state('default.userEdit', {
            url: "users/{id:int}",
            templateUrl: "views/users/form.html",
            controller: usersEditController
        })
        .state('default.userCreate', {
            url: "users/create",
            templateUrl: "views/users/form.html",
            controller: usersEditController
        })
        .state('404', {
            url: "/404",
            templateUrl: "404.html",
            data: { pageTitle: '404', specialClass: 'gray-bg' }
        });


    $validatorProvider.setDefaults({
        errorElement: 'label',
        errorClass: 'help-block error'
    });

    $httpProvider.interceptors.push('authHandler');
    $httpProvider.interceptors.push('httpVisualizer');
}

function httpVisualizer($rootScope, toaster, $q) {
    return {
        request: function (request) {
            $rootScope.queue++;
            if (!$rootScope.inProgress) {
                $rootScope.inProgress = true;
            }
            return request;
        },
        response: function(response) {
            $rootScope.queue--;
            if ($rootScope.queue <= 0) {
                $rootScope.inProgress = false;
            }

            return response;
        },
        responseError: function(response) {
            $rootScope.queue--;
            if ($rootScope.queue <= 0) {
                $rootScope.inProgress = false;
            }

            if (response.status == 401) {
                return $q.reject(response);
            }

            toaster.pop({
                type: 'error',
                title: 'Error',
                body: response.data.details || response.data.message || response.statusText,
                showCloseButton: true,
                timeout: 3500
            });

            return $q.reject(response);
        }
    };
}

function authHandler($cookies, $q, $location) {
    return {
        request: function (request) {
            var token = $cookies.get('Authorization');
            if (token) {
                request.headers.Authorization = token;
            }
            return request;
        },
        responseError: function(response) {
            if (response.status === 401) {
                return $location.path('/login');
            }
            return $q.reject(response);
        }
    };
}

angular
    .module('CR_Template')
    .config(config)
    .run(function($rootScope, $state, Profile) {
        $rootScope.queue = 0;
        $rootScope.$state = $state;
        $rootScope.now = new Date();
        Profile.getCurrent()
            .then(function () {

            }, function () {
                $state.go('login');
            });

        $rootScope.$on('$stateChangeStart', function(evt, to, params) {
            if (to.redirectTo) {
                evt.preventDefault();
                $state.go(to.redirectTo, params)
            }
        });
        
        $rootScope.logout = function () {
            Profile.logout();
            $state.go('login');
        }
    })
    .factory('authHandler', ['$cookies', '$q', '$location', authHandler])
    .factory('httpVisualizer', ['$rootScope', 'toaster', '$q', httpVisualizer]);
