
angular.module('createListApp', [])
    .controller('CreateListController', ['$scope', function($scope) {
        $scope.recipes = [
            {"_name":"Cashew Chicken and Broccoli","_ingredients":{"_ingredients":[{"_item":"broccoli","_amount":"4"},{"_item":"cashews","_amount":"1"},{"_item":"onion","_amount":"1/2"}]}}];

        $scope.shoppingList = [];

        $scope.categories = [
            {name: "Fruit", order: 1, items: ["salt", "Orange"]},
            {name: "Meat", order: 1, items: ["Chicken", "pepper"]}];

        $scope.calculateShoppingList = function() {
            var ingredientList = [];
            angular.forEach($scope.recipes, function(recipe) {
                if (recipe._selected) ingredientList.push(recipe._ingredients._ingredients[0]._item);
            });

            $scope.shoppingList = [];
            var leftoverList = angular.copy(ingredientList);
            angular.forEach($scope.categories, function(category) {
                var shoppingListCategory = {name: category.name, items: []};
                angular.forEach(category.items, function(item) {
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
