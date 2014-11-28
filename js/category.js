
"use strict";

angular.module('bruleeApp', ['bruleeApp.services'])

    .service('client', function (recipesFactory) {
        return recipesFactory;
    })

    .controller('CategoryCtrl', function($scope, client) {
        $scope.categories = [];
        client.getCategories().then(function (categories) {
            $scope.categories = categories;
        });

        $scope.saveCategories = function() {
            client.updateCategories($scope.categories);
        };

        $scope.removeItem = function(itemIndex, category) {
            category.items.splice(itemIndex, 1);
        };

    });
