
angular.module('createListApp', ['recipesService'])

    .service('client', function (recipesFactory) {
        return recipesFactory;
    })

    .controller('CreateListController', function($scope, client) {
        $scope.recipes = [];
        client.getRecipes().then(function (recipes) {
            $scope.recipes = recipes;
        });

        $scope.categories = [];
        client.getCategories().then(function (categories) {
            $scope.categories = categories;
        });

        $scope.shoppingList = [];

        $scope.calculateShoppingList = function() {
            var ingredientList = [];
            angular.forEach($scope.recipes, function(recipe) {
                if (recipe._selected) ingredientList = Ingredients.combineAll(ingredientList, recipe.ingredients);
            });

            $scope.shoppingList = [];
            var leftoverList = ingredientList.map(function(ingredient) {
                return ingredient.item;
            });
            angular.forEach($scope.categories, function(category) {
                var shoppingListCategory = {name: category.name, items: []};
                angular.forEach(category.items, function(item) {
                    var ingredient = Ingredients.getByItem(ingredientList, item);
                    if (ingredient !== null) {
                        shoppingListCategory.items.push(item);
                    }
                    leftoverList = leftoverList.filter(function(element) {
                        return element !== item;
                    });
                });
                $scope.shoppingList.push(shoppingListCategory);
            });

            $scope.shoppingList.push({name: "Leftovers", items: leftoverList});
        };
    });
