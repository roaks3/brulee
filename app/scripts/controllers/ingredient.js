'use strict';

angular.module('bruleeApp')

  .controller('IngredientCtrl', function ($routeParams, $scope, categoryService, Ingredient, recipeService) {

    $scope.errors = [];
    $scope.successMessage = null;

    $scope.categories = [];
    categoryService.findAll()
      .then(function (data) {
        $scope.categories = data;
        $scope.category = categoryService.getByIngredientId($routeParams.id);
      })
      .catch(function (error) {
        $scope.errors.push(error);
      });

    $scope.ingredients = [];
    $scope.ingredient = {};
    Ingredient.refreshAll()
      .then(function (data) {
        $scope.ingredients = data;
        $scope.ingredient = Ingredient.get($routeParams.id);
        $scope.ingredientName = $scope.ingredient.name;
      })
      .catch(function (error) {
        $scope.errors.push(error);
      });

    $scope.recipes = [];
    recipeService.findAll()
      .then(function () {
        $scope.recipes = recipeService.filterByIngredientId($routeParams.id);
      })
      .catch(function (error) {
        $scope.errors.push(error);
      });

    $scope.delete = function () {
      if ($scope.recipes && $scope.recipes.length) {
        alert('Cannot delete because ingredient is being used in recipes');
        return;
      }

      if ($scope.category) {
        alert('Cannot delete because ingredient belongs to a category');
        return;
      }

      if (!confirm('Remove \'' + $scope.ingredient.name + '\'?')) {
        return;
      }

      $scope.errors = [];
      $scope.successMessage = null;

      Ingredient.destroy($scope.ingredient.id)
        .then(function () {
          $scope.successMessage = 'Deleted ingredient';
          // TODO: Redirect back to ingredient page
        })
        .catch(function (error) {
          $scope.errors.push(error);
        });
    };

    $scope.save = function () {
      var otherIngredientNames = _($scope.ingredients)
        .reject(['id', $scope.ingredient.id])
        .map('name')
        .value();

      if (_.includes(otherIngredientNames, $scope.ingredientName)) {
        alert('This ingredient name already exists');
        return;
      }

      $scope.errors = [];
      $scope.successMessage = null;

      Ingredient.update($scope.ingredient.id, {
        name: $scope.ingredientName
      })
        .then(function () {
          $scope.successMessage = 'Saved ingredient';
        })
        .catch(function (error) {
          $scope.errors.push(error);
        });
    };

  });
