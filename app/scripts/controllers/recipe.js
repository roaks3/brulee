'use strict';

angular.module('bruleeApp')

  .controller('RecipeCtrl', ($q, $routeParams, $scope, categoryService, recipeService) => {

    $scope.errors = [];
    $scope.successMessage = null;

    $scope.recipe = {};
    $q.all([
      recipeService.findAll(),
      categoryService.findAll()
    ])
      .then(() => {
        $scope.recipe = recipeService.get($routeParams.id);

        // Add category to each ingredient in the recipe
        _.each($scope.recipe.recipe_ingredients, (recipe_ingredient) => {
          recipe_ingredient.selectedCategory = categoryService.getByIngredientId(recipe_ingredient.ingredient.id);
        });

        $scope.originalTextLines = $scope.recipe.original_text.split('\n');
      })
      .catch((error) => {
        $scope.errors.push(error);
      });

  });
