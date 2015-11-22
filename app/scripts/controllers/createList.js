
'use strict';

angular.module('bruleeApp')

  .controller('CreateListCtrl', function ($q, $scope, categoryService, ingredientService, recipesService) {
    
    $scope.recipes = [];
    recipesService.recipes()
      .then(function (recipes) {
        $scope.recipes = recipes;
      });

    $scope.categories = [];
    $q.all([
      categoryService.categories(),
      ingredientService.ingredients()
    ])
      .then(function (data) {
        var categories = data[0];
        var ingredients = data[1];

        var ingredientsById = _.indexBy(ingredients, 'id');

        $scope.categories = _.map(categories, function (category) {
          return {
            name: category.name,
            order: category.order,
            items: _.map(category.ingredient_ids, function (ingredientId) {
              return ingredientsById[ingredientId].name;
            })
          };
        });
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
            shoppingListCategory.items[item] = {recipes: itemRecipes};
          }
          leftoverList = leftoverList.filter(function(element) {
            return element !== item;
          });
        });
        $scope.shoppingList.push(shoppingListCategory);
      });

      var shoppingListCategory = {name: 'Leftovers', items: {}};
      angular.forEach(leftoverList, function(item) {
        var itemRecipes = itemRecipeMap[item];
        if (itemRecipes !== undefined) {
          shoppingListCategory.items[item] = {recipes: itemRecipes};
        }
      });

      $scope.shoppingList.push(shoppingListCategory);
    };
  });
