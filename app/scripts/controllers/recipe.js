'use strict';

angular.module('bruleeApp')

  .controller('RecipeCtrl', ($q, $stateParams, $scope, $window, Category, categoryService, Recipe) => {

    $scope.errors = [];
    $scope.successMessage = null;

    $scope.recipe = {};
    $q.all([
      Recipe.find($stateParams.id),
      // HACK: This should be fixed by using a category id field directly on the ingredient
      Category.refreshAll()
    ])
      .then((data) => {
        $scope.recipe = _.cloneDeep(data[0]);
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

      if (!_.every($scope.recipe.recipe_ingredients, 'ingredient_id')) {
        $window.alert('Recipe cannot be saved with invalid ingredients');
        return;
      }

      let recipeIngredients = _.map($scope.recipe.recipe_ingredients,
        (ri) => _.pick(ri, ['ingredient_id', 'amount']));

      Recipe
        .update($scope.recipe.id, _.assign(
          _.pick($scope.recipe, ['name', 'original_text', 'url', 'tags']),
          {recipe_ingredients: recipeIngredients}
        ))
        .then(() => {
          $scope.successMessage = 'Saved recipe';
        })
        .catch((error) => {
          $scope.errors.push(error);
        });
    };

    $scope.addRecipeIngredient = () => {
      $scope.recipe.recipe_ingredients.push({
        ingreident_id: null,
        amount: 1
      });
    };

    $scope.removeRecipeIngredient = (recipeIngredient) => {
      _.pull($scope.recipe.recipe_ingredients, recipeIngredient);
    };

    $scope.updateRecipeIngredient = (recipeIngredient, ingredientId) => {
      recipeIngredient.ingredient_id = ingredientId || null;
    };

  });
