
angular.module('createListApp', [])
    .controller('CreateListController', ['$scope', function($scope) {
        $scope.recipes = [
            {"_name":"Cashew Chicken and Broccoli","_ingredients":{"_ingredients":[{"_item":"cucumber","_amount":"4"},{"_item":"cashews","_amount":"1"},{"_item":"onion","_amount":"1/2"}]}}];

        $scope.shoppingList = [];

        $scope.categories = [
            {"_name": "Fruits/Vegetables", "_order": 1, "_items": ["cucumber", "pobalano chili", "lime", "asparagus", "red potatoes"] }];

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
    }]);
