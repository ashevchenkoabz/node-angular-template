(function (angular) {
    angular.module('CR_Template', [
        'ui.router',                    // Routing
        'oc.lazyLoad',                  // ocLazyLoad
        'ui.bootstrap',                 // Ui Bootstrap
        'ngSanitize',                   // ngSanitize
        'ngValidate',                   // ngValidate
        'ngCookies',
        'toaster',                      // toaster notifications
        'ngFileUpload',                 // upload file
        'ngAnimate'
    ])
})(window.angular);
