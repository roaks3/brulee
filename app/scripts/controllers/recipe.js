'use strict';

angular.module('bruleeApp')

  .controller('RecipeCtrl', ($q, $routeParams, $scope, Category, categoryService, recipeService) => {

    $scope.errors = [];
    $scope.successMessage = null;

    $scope.recipe = {};
    $q.all([
      recipeService.findAll(),
      Category.refreshAll()
    ])
      .then(() => {
        $scope.recipe = recipeService.get($routeParams.id);

        // Add category to each ingredient in the recipe
        _.each($scope.recipe.recipe_ingredients, (recipe_ingredient) => {
          recipe_ingredient.selectedCategory = categoryService.getByIngredientId(recipe_ingredient.ingredient.id);
        });

        $scope.originalTextLines = $scope.recipe.original_text.split('\n');
        $scope.recipeName = $scope.recipe.name;
        $scope.recipeUrl = $scope.recipe.url;
      })
      .catch((error) => {
        $scope.errors.push(error);
      });

    $scope.delete = () => {
      if (!confirm('Remove \'' + $scope.recipe.name + '\'?')) {
        return;
      }

      $scope.errors = [];
      $scope.successMessage = null;

      recipeService.destroy($scope.recipe.id)
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

      recipeService.update({
        id: $scope.recipe.id,
        name: $scope.recipeName,
        url: $scope.recipeUrl
      })
        .then(() => {
          $scope.successMessage = 'Saved recipe';
        })
        .catch((error) => {
          $scope.errors.push(error);
        });
    };

  });
