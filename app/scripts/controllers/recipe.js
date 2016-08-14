'use strict';

angular.module('bruleeApp')

  .controller('RecipeCtrl', ($q, $routeParams, $scope, $window, Category, categoryService, Recipe) => {

    $scope.errors = [];
    $scope.successMessage = null;

    $scope.recipe = {};
    $q.all([
      Recipe.refreshAll(),
      Category.refreshAll()
    ])
      .then(() => {
        $scope.recipe = Recipe.get($routeParams.id);

        // Add category to each ingredient in the recipe
        _.each($scope.recipe.recipe_ingredients, (recipeIngredient) => {
          recipeIngredient.selectedCategory = categoryService.getByIngredientId(recipeIngredient.ingredient_id);
        });

        $scope.originalTextLines = $scope.recipe.original_text.split('\n');
        $scope.recipeName = $scope.recipe.name;
        $scope.recipeUrl = $scope.recipe.url;
      })
      .catch((error) => {
        $scope.errors.push(error);
      });

    $scope.delete = () => {
      if (!$window.confirm('Remove \'' + $scope.recipe.name + '\'?')) {
        return;
      }

      $scope.errors = [];
      $scope.successMessage = null;

      Recipe
        .destroy($scope.recipe.id)
        .then(() => {
          $scope.successMessage = 'Deleted recipe';
          // TODO: Redirect back to recipe page
        })
        .catch((error) => {
          $scope.errors.push(error);
        });
    };

    $scope.save = () => {
      $scope.errors = [];
      $scope.successMessage = null;

      Recipe
        .update($scope.recipe.id, {
          name: $scope.recipeName,
          original_text: $scope.recipe.original_text,
          url: $scope.recipeUrl,
          recipe_ingredients: _.map($scope.recipe.recipe_ingredients, function (recipeIngredient) {
            return {
              ingredient_id: recipeIngredient.ingredient_id,
              amount: recipeIngredient.amount
            };
          })
        })
        .then(() => {
          $scope.successMessage = 'Saved recipe';
        })
        .catch((error) => {
          $scope.errors.push(error);
        });
    };

  });
