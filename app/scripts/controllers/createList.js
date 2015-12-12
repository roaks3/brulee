
'use strict';

angular.module('bruleeApp')

  .controller('CreateListCtrl', function ($q, $scope, $timeout, categoryEditorService, categoryService, ingredientService, recipesService) {
    
    $scope.recipes = [];

    $scope.refreshRecipes = function () {
      return $q.all([
        recipesService.recipes(),
        ingredientService.ingredients()
      ])
        .then(function (data) {
          var recipes = data[0];
          var ingredients = data[1];

          var ingredientsById = _.indexBy(ingredients, 'id');

          $scope.recipes = _.map(recipes, function (recipe) {
            return {
              name: recipe.name,
              originalText: recipe.original_text,
              ingredients: _.map(recipe.recipe_ingredients, function (recipeIngredient) {
                return {
                  item: ingredientsById[recipeIngredient.ingredient_id].name,
                  amount: recipeIngredient.amount
                };
              })
            };
          });
        });
    };

    $scope.categories = [];

    $scope.refreshCategories = function () {
      $scope.errors = [];
      $scope.successMessage = null;

      $scope.categories = [];
      categoryEditorService.categories()
        .then(function (data) {
          $scope.categories = data;
        })
        .catch(function (error) {
          $scope.errors.push(error);
        });
    };

    $scope.refreshRecipes();

    $timeout(function () {
      $scope.refreshCategories();
    }, 1000);

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
        angular.forEach(category.ingredients, function(ingredient) {
          var itemRecipes = itemRecipeMap[ingredient.name];
          if (itemRecipes !== undefined) {
            shoppingListCategory.items[ingredient.name] = {recipes: itemRecipes};
          }
          leftoverList = leftoverList.filter(function(element) {
            return element !== ingredient.name;
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
