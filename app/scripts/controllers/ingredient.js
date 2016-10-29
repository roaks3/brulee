'use strict';

angular.module('bruleeApp')

  .controller('IngredientCtrl', function ($state, $stateParams, $scope, $window,
                                          Category, categoryService, Ingredient,
                                          Recipe, recipeService) {

    $scope.errors = [];
    $scope.successMessage = null;

    Category.refreshAll()
      .then(function () {
        $scope.category = categoryService.getByIngredientId($stateParams.id);
      })
      .catch(function (error) {
        $scope.errors.push(error);
      });

    $scope.ingredients = [];
    $scope.ingredient = {};
    Ingredient.refreshAll()
      .then(function (data) {
        $scope.ingredients = data;
        $scope.ingredient = Ingredient.get($stateParams.id);
        $scope.ingredientName = $scope.ingredient.name;
      })
      .catch(function (error) {
        $scope.errors.push(error);
      });

    $scope.recipes = [];
    Recipe.refreshAll()
      .then(function () {
        $scope.recipes = recipeService.filterByIngredientId($stateParams.id);
      })
      .catch(function (error) {
        $scope.errors.push(error);
      });

    $scope.delete = function () {
      if ($scope.recipes && $scope.recipes.length) {
        $window.alert('Cannot delete because ingredient is being used in recipes');
        return;
      }

      if ($scope.category) {
        $window.alert('Cannot delete because ingredient belongs to a category');
        return;
      }

      if (!$window.confirm('Remove \'' + $scope.ingredient.name + '\'?')) {
        return;
      }

      $scope.errors = [];
      $scope.successMessage = null;

      Ingredient.destroy($scope.ingredient.id)
        .then(function () {
          $state.go('ingredients');
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
        $window.alert('This ingredient name already exists');
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
