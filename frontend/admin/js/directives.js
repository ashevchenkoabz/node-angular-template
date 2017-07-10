/**
 * INSPINIA - Responsive Admin Theme
 *
 * Main directives.js file
 * Define directives for used plugin
 *
 *
 * Functions (directives)
 *  - sideNavigation
 *  - iboxTools
 *  - minimalizaSidebar
 *  - vectorMap
 *  - sparkline
 *  - icheck
 *  - ionRangeSlider
 *  - dropZone
 *  - responsiveVideo
 *  - chatSlimScroll
 *  - customValid
 *  - fullScroll
 *  - closeOffCanvas
 *  - clockPicker
 *  - landingScrollspy
 *  - fitHeight
 *  - iboxToolsFullScreen
 *  - slimScroll
 *
 */


/**
 * pageTitle - Directive for set Page title - mata title
 */
function pageTitle($rootScope, $timeout) {
    return {
        link: function(scope, element) {
            var listener = function(event, toState, toParams, fromState, fromParams) {
                if (toState.data && toState.data.pageTitle) title = 'SF | ' + toState.data.pageTitle;
                $timeout(function() {
                    element.text(title);
                });
            };
            $rootScope.$on('$stateChangeStart', listener);
        }
    }
};


function specialBodyClass($rootScope, $timeout) {
    return {
        link: function(scope, element) {
            var listener = function(event, toState, toParams, fromState, fromParams) {
                if (toState.data && toState.data.specialClass){
                    $timeout(function() {
                        element.addClass(toState.data.specialClass);
                    });
                } else {
                    element.attr('class', '');
                }
            };
            $rootScope.$on('$stateChangeStart', listener);
        }
    }
};


/**
 * sideNavigation - Directive for run metsiMenu on sidebar navigation
 */
function sideNavigation($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element) {
            // Call the metsiMenu plugin and plug it to sidebar navigation
            $timeout(function(){
                element.metisMenu();

            });
        }
    };
};

/**
 * iboxTools - Directive for iBox tools elements in right corner of ibox
 */
function iboxTools($timeout) {
    return {
        restrict: 'A',
        scope: true,
        templateUrl: 'views/common/ibox_tools.html',
        controller: function ($scope, $element) {
            // Function for collapse ibox
            $scope.showhide = function () {
                var ibox = $element.closest('div.ibox');
                var icon = $element.find('i:first');
                var content = ibox.find('div.ibox-content');
                content.slideToggle(200);
                // Toggle icon from up to down
                icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
                ibox.toggleClass('').toggleClass('border-bottom');
                $timeout(function () {
                    ibox.resize();
                    ibox.find('[id^=map-]').resize();
                }, 50);
            };
            // Function for close ibox
            $scope.closebox = function () {
                var ibox = $element.closest('div.ibox');
                ibox.remove();
            }
        }
    };
}

/**
 * minimalizaSidebar - Directive for minimalize sidebar
 */
function minimalizaSidebar($timeout) {
    return {
        restrict: 'A',
        template: '<a class="navbar-minimalize minimalize-styl-2 btn btn-primary " href="" ng-click="minimalize()"><i class="fa fa-bars"></i></a>',
        controller: function ($scope, $element, $rootScope) {
            $scope.minimalize = function () {
                $rootScope.$broadcast('resize')
                $("body").toggleClass("mini-navbar");
                if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
                    // Hide menu in order to smoothly turn on when maximize menu
                    $('#side-menu').hide();
                    // For smoothly turn on menu
                    setTimeout(
                        function () {
                            $('#side-menu').fadeIn(500);
                        }, 100);
                } else if ($('body').hasClass('fixed-sidebar')){
                    $('#side-menu').hide();
                    setTimeout(
                        function () {
                            $('#side-menu').fadeIn(500);
                        }, 300);
                } else {
                    // Remove all inline style from jquery fadeIn function to reset menu state
                    $('#side-menu').removeAttr('style');
                }
            }
        }
    };
};



/**
 * sparkline - Directive for Sparkline chart
 */
function sparkline() {
    return {
        restrict: 'A',
        scope: {
            sparkData: '=',
            sparkOptions: '=',
        },
        link: function (scope, element, attrs) {
            scope.$watch(scope.sparkData, function () {
                render();
            });
            scope.$watch(scope.sparkOptions, function(){
                render();
            });
            var render = function () {
                $(element).sparkline(scope.sparkData, scope.sparkOptions);
            };
        }
    }
};



/**
 * fullScroll - Directive for slimScroll with 100%
 */
function fullScroll($timeout){
    return {
        restrict: 'A',
        link: function(scope, element) {
            $timeout(function(){
                element.slimscroll({
                    height: '100%',
                    railOpacity: 0.9
                });

            });
        }
    };
}

/**
 * slimScroll - Directive for slimScroll with custom height
 */
function slimScroll($timeout){
    return {
        restrict: 'A',
        scope: {
            boxHeight: '@'
        },
        link: function(scope, element) {
            $timeout(function(){
                element.slimscroll({
                    height: scope.boxHeight,
                    railOpacity: 0.9
                });

            });
        }
    };
}

/**
 * clockPicker - Directive for clock picker plugin
 */
function clockPicker() {
    return {
        restrict: 'A',
        link: function(scope, element) {
            element.clockpicker();
        }
    };
};


/**
 * landingScrollspy - Directive for scrollspy in landing page
 */
function landingScrollspy(){
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.scrollspy({
                target: '.navbar-fixed-top',
                offset: 80
            });
        }
    }
}

/**
 * fitHeight - Directive for set height fit to window height
 */
function fitHeight(){
    return {
        restrict: 'A',
        link: function(scope, element) {
            element.css("height", $(window).height() + "px");
            element.css("min-height", $(window).height() + "px");
        }
    };
}

function DT_itemsPerPage () {
    return {
        restrict: 'A',
        templateUrl: '/admin/views/common/dataTables/items_on_page.html',
        controller: function ($scope) {
            $scope.options = [10, 25, 50, 100];
        }
    }
}

function DT_Pagination () {
    return {
        restrict: 'A',
        templateUrl: '/admin/views/common/dataTables/pagination.html',
        controller: function ($scope) {
            $scope.$watch('total', fillPagesArray);
            $scope.selectedPage = 1;
            $scope.totalPages = 0;

            $scope.setPage = function (pageNum) {
                if (pageNum < 1 || pageNum > $scope.totalPages || pageNum == $scope.selectedPage) {
                    fillPagesArray();
                    return false;
                }

                $scope.selectedPage = pageNum;
                fillPagesArray();
                $scope.filters.offset = $scope.filters.limit * (pageNum - 1);
                $scope.getList();
            };

            $scope.$watch('filters.limit', function () {
                $scope.setPage(1);
            });

            function fillPagesArray (now, prev) {
                if (now !== prev) {
                    $scope.selectedPage = 1;
                }

                $scope.pagesArray = [];
                $scope.totalPages = Math.ceil($scope.total/$scope.filters.limit);
                console.log($scope.totalPages)
                $scope.pagesArray.push($scope.selectedPage);

                var pushedPagesLeft = 3;
                var unshiftedPagesLeft = 3;
                var unshiftedPage = $scope.selectedPage - 1;
                var pushedPage = $scope.selectedPage + 1;

                if ($scope.selectedPage > $scope.totalPages/2) {
                    while (pushedPage <= $scope.totalPages && pushedPagesLeft > 0) {
                        $scope.pagesArray.push(pushedPage);
                        pushedPage++;
                        pushedPagesLeft--;
                    }
                    unshiftedPagesLeft += pushedPagesLeft;

                    while (unshiftedPage > 0 && unshiftedPagesLeft > 0) {
                        $scope.pagesArray.unshift(unshiftedPage);
                        unshiftedPage--;
                        unshiftedPagesLeft--;
                    }


                } else {
                    while (unshiftedPage > 0 && unshiftedPagesLeft > 0) {
                        $scope.pagesArray.unshift(unshiftedPage);
                        unshiftedPage--;
                        unshiftedPagesLeft--;
                    }
                    pushedPagesLeft += unshiftedPagesLeft;

                    while (pushedPage <= $scope.totalPages && pushedPagesLeft > 0) {
                        $scope.pagesArray.push(pushedPage);
                        pushedPage++;
                        pushedPagesLeft--;
                    }
                }
            }
        }
    }
}


function DT_Search () {
    return {
        restrict: 'A',
        templateUrl: '/admin/views/common/dataTables/search.html',
        controller: function ($scope) {
            $scope.search = function () {
                $scope.filters.offset = 0;
                $scope.getList();
            }
        }
    }
}

function DT_Order () {
    return {
        restrict: 'A',
        controller: function ($scope, $element) {
            var sortType = 'desc';
            $element.addClass('sortable');
            $element.on('click', function () {
                $('.sortable').removeClass('sorting_desc sorting_asc');
                sortType = sortType == 'desc' ? 'asc' : 'desc';
                $element.addClass('sorting_' + sortType)
                $scope.filters.order_type = sortType;
                $scope.filters.order_field = $element.data('field');

                $scope.getList();
            });
        }
    }
}

/**
 *
 * Pass all functions into module
 */
angular
    .module('CR_Template')
    .directive('pageTitle', pageTitle)
    .directive('sideNavigation', sideNavigation)
    .directive('iboxTools', iboxTools)
    .directive('minimalizaSidebar', minimalizaSidebar)
    .directive('sparkline', sparkline)
    .directive('fullScroll', fullScroll)
    .directive('clockPicker', clockPicker)
    .directive('fitHeight', fitHeight)
    .directive('slimScroll', slimScroll)
    .directive('specialBodyClass', specialBodyClass)
    .directive('itemsOnPage', DT_itemsPerPage)
    .directive('tablePagination', DT_Pagination)
    .directive('tableSearch', DT_Search)
    .directive('orderingColumn', DT_Order)
