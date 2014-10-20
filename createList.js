
angular.module('createListApp', [])
    .controller('CreateListController', ['$scope', function($scope) {
        $scope.recipes = [
            {name: "Chicken Parm", selected: true, ingredient: "salt"},
            {name: "Salsa Verde", selected: false, ingredient: "pepper"}];

        $scope.shoppingList = [];

        $scope.categories = [
            {name: "Fruit", order: 1, items: ["salt", "Orange"]},
            {name: "Meat", order: 1, items: ["Chicken", "pepper"]}];

        $scope.calculateShoppingList = function() {
            var ingredientList = [];
            angular.forEach($scope.recipes, function(recipe) {
                if (recipe.selected) ingredientList.push(recipe.ingredient);
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
                    //leftoverList.remove(item);
                    leftoverList = leftoverList.filter(function(element) {
                        return !(element === item);
                    });
                });
                $scope.shoppingList.push(shoppingListCategory);
            });

            $scope.shoppingList.push({name: "Leftovers", items: leftoverList});
        };
    }]);
