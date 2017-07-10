"use strict";

function DataTable ($location, $uibModal) {
    return {
        initialize: function (modelService) {
            var scope = this;
            scope.dataSetReady = false;
            scope.getList = function (refresh) {
                if (refresh) {
                    scope.filters = {
                        q: '',
                        offset: 0,
                        limit: 25,
                        order_field: null,
                        order_type: null
                    };
                    $location.search('')
                }

                modelService.getList(scope.filters)
                    .success(function (data) {
                        if (refresh) {
                            scope.totalWithoutFilters = data.total;
                        }
                        console.log(data);
                        scope.total = data.total;
                        scope.items = data.items;
                        if (!refresh) {
                            $location.search(scope.filters);
                        }
                        scope.dataSetReady = true;
                    })
            };

            var search = $location.search();
            var refresh = true;
            if (Object.keys(search).length) {
                scope.filters = {
                    q: search.q,
                    offset: parseInt(search.offset),
                    limit: parseInt(search.limit),
                    order_field: search.order_field,
                    order_type: search.order_type
                };
                refresh = false;
            } else {
                scope.filters = {
                    q: '',
                    offset: 0,
                    limit: 25,
                    order_field: null,
                    order_type: null
                };
            }

            scope.total = 0;
            scope.items = [];

            scope.getList(refresh);


            scope.askDelete = function (id) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'views/common/modal_confirm.html',
                    size: 'sm'
                });

                modalInstance.result
                    .then(function () {
                        modelService.delete(id)
                            .success(function () {
                                scope.getList(true);
                            });
                    })
            };
        }
    }
}

angular.module('CR_Template')
    .service('DataTable', DataTable);

