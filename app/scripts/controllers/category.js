
'use strict';

angular.module('bruleeApp')

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

        $scope.addCategory = function(categoryName) {
            var category = new Category(null, categoryName, null, null);
            client.createCategory(category).then(function (id) {
                category.id = id;
                $scope.categories.push(category);
                console.log(JSON.stringify(category));
            });
        };

        $scope.removeCategory = function(category) {
            client.removeCategory(category.id).then(function () {
                var index = $scope.categories.indexOf(category);
                $scope.categories.splice(index, 1);
            });
        };

        $scope.removeItem = function(itemIndex, category) {
            category.items.splice(itemIndex, 1);
        };

    });
