
'use strict';

angular.module('bruleeApp')

  .controller('CreateListCtrl', function ($q, $scope, $timeout, categoryEditorService, categoryService, ingredientService, recipesService) {
    
    $scope.recipes = [];
    $scope.ingredientsById = {};

    $scope.refreshRecipes = function () {
      return $q.all([
        recipesService.recipes(),
        ingredientService.ingredients()
      ])
        .then(function (data) {
          var recipes = data[0];
          var ingredients = data[1];

          $scope.ingredientsById = _.indexBy(ingredients, 'id');
          $scope.recipes = _.map(recipes, function (recipe) {
            return {
              id: recipe.id,
              name: recipe.name,
              originalText: recipe.original_text,
              recipe_ingredients: _.map(recipe.recipe_ingredients, function (recipeIngredient) {
                return {
                  ingredient: $scope.ingredientsById[recipeIngredient.ingredient_id],
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

    $scope.calculateShoppingList = function () {
      var selectedRecipes = _($scope.recipes)
        .filter('_selected')
        .value();

      var recipeNamesByIngredientId = _.reduce(selectedRecipes, function (memo, recipe) {
        _.each(recipe.recipe_ingredients, function(recipe_ingredient) {
          memo[recipe_ingredient.ingredient.id] = memo[recipe_ingredient.ingredient.id] || [];
          memo[recipe_ingredient.ingredient.id].push(recipe.name);
        });
        return memo;
      }, {});

      // Remove ingredients from the list that are not in the selected recipes
      $scope.shoppingList = _.map($scope.categories, function (category) {
        return {
          name: category.name,
          ingredients: _(category.ingredients)
            .filter(function (ingredient) {
              return recipeNamesByIngredientId[ingredient.id];
            })
            .value()
        };
      });

      // Gather ids for the uncategorized ingredients
      var leftoverIngredientIds = _.difference(
        _.keys(recipeNamesByIngredientId),
        _($scope.shoppingList)
          .map(function (category) {
            return _.pluck(category.ingredients, 'id');
          })
          .flatten()
          .value()
      );

      // Create leftover category for uncategorized ingredients
      $scope.shoppingList.push({
        name: 'Leftovers',
        ingredients: _.map(leftoverIngredientIds, function (ingredientId) {
          return $scope.ingredientsById[ingredientId];
        })
      });

      // Add recipe names to each ingredient
      $scope.shoppingList = _.map($scope.shoppingList, function (category) {
        return {
          name: category.name,
          ingredients: _(category.ingredients)
            .map(function (ingredient) {
              return _.assign(ingredient, {
                recipes: recipeNamesByIngredientId[ingredient.id]
              });
            })
            .value()
        };
      });
    };
  });
