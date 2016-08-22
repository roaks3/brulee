'use strict';

angular.module('bruleeApp')

  .controller('RecipeCtrl', ($q, $routeParams, $scope, $window, Category, categoryService, Recipe) => {

    $scope.errors = [];
    $scope.successMessage = null;

    $scope.recipe = {};
    $q.all([
      Recipe.find($routeParams.id),
      Category.refreshAll()
    ])
      .then((data) => {
        $scope.recipe = _.cloneDeep(data[0]);

        // Add category to each ingredient in the recipe
        _.each($scope.recipe.recipe_ingredients, (recipeIngredient) => {
          recipeIngredient.selectedCategory = categoryService.getByIngredientId(recipeIngredient.ingredient_id);
        });

        $scope.originalTextLines = $scope.recipe.original_text.split('\n');
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
          name: $scope.recipe.name,
          original_text: $scope.recipe.original_text,
          url: $scope.recipe.url,
          recipe_ingredients: _.map($scope.recipe.recipe_ingredients, function (recipeIngredient) {
            return {
              // NOTE: It's weird that the ingredient.id is needed here and the
              // ingredient_id remains unchanged. The input directive should
              // update both or only use ingredient_id
              ingredient_id: recipeIngredient.ingredient.id,
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

    $scope.removeRecipeIngredient = (recipeIngredient) => {
      _.pull($scope.recipe.recipe_ingredients, recipeIngredient);
    };

  });
