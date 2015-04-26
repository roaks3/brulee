
'use strict';

angular.module('bruleeApp')

  .service('client', function (recipesFactory) {
    return recipesFactory;
  })

  .controller('CreateListCtrl', function($scope, client) {
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
      var itemRecipeMap = {};
      angular.forEach($scope.recipes, function(recipe) {
        if (recipe._selected) {
          angular.forEach(recipe.ingredients, function(ingredient) {
            var itemRecipes = itemRecipeMap[ingredient.item];
            if (itemRecipes === undefined) {
              itemRecipeMap[ingredient.item] = [recipe.name];
            } else {
              itemRecipes.push(recipe.name);
            }
          });
        }
      });

      $scope.shoppingList = [];
      var leftoverList = Object.keys(itemRecipeMap);
      angular.forEach($scope.categories, function(category) {
        var shoppingListCategory = {name: category.name, items: {}};
        angular.forEach(category.items, function(item) {
          var itemRecipes = itemRecipeMap[item];
          if (itemRecipes !== undefined) {
            shoppingListCategory.items[item] = itemRecipes;
          }
          leftoverList = leftoverList.filter(function(element) {
            return element !== item;
          });
        });
        $scope.shoppingList.push(shoppingListCategory);
      });

      var shoppingListCategory = {name: "Leftovers", items: {}};
      angular.forEach(leftoverList, function(item) {
        var itemRecipes = itemRecipeMap[item];
        if (itemRecipes !== undefined) {
          shoppingListCategory.items[item] = itemRecipes;
        }
      });

      $scope.shoppingList.push(shoppingListCategory);
    };
  });
