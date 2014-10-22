
angular.module('createListApp', ['elasticsearch'])

    .service('client', function (esFactory) {
        return esFactory({
            host: 'localhost:9200',
            apiVersion: '1.2',
            log: 'trace'
        });
    })

    .controller('CreateListController', function($scope, client, esFactory) {
        $scope.recipes = [];
        client.search({
            index: 'recipes',
            type: 'recipe',
            size: 500,
            body: {
                query: {
                    match_all: {}
                }
            }
        }).then(function (body) {
            var hits = body.hits.hits;
            $scope.recipes = hits.map(function(element) {
                return element._source;
            });
        }, function (error) {
            console.trace(error.message);
        });

        $scope.shoppingList = [];

        $scope.categories = [];
        client.search({
            index: 'recipes',
            type: 'category',
            size: 500,
            body: {
                query: {
                    match_all: {}
                }
            }
        }).then(function (body) {
            var hits = body.hits.hits;
            $scope.categories = hits.map(function(element) {
                return element._source;
            });
        }, function (error) {
            console.trace(error.message);
        });

        $scope.calculateShoppingList = function() {
            var ingredientList = [];
            angular.forEach($scope.recipes, function(recipe) {
                if (recipe._selected) ingredientList.push(recipe._ingredients._ingredients[0]._item);
            });

            $scope.shoppingList = [];
            var leftoverList = angular.copy(ingredientList);
            angular.forEach($scope.categories, function(category) {
                var shoppingListCategory = {name: category._name, items: []};
                angular.forEach(category._items, function(item) {
                    angular.forEach(ingredientList, function(ingredient) {
                        if (item === ingredient) {
                            shoppingListCategory.items.push(item);
                        }
                    });
                    leftoverList = leftoverList.filter(function(element) {
                        return !(element === item);
                    });
                });
                $scope.shoppingList.push(shoppingListCategory);
            });

            $scope.shoppingList.push({name: "Leftovers", items: leftoverList});
        };
    });
