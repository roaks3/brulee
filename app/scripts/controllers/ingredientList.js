'use strict';

angular.module('bruleeApp')

  .controller('IngredientListCtrl', function ($sessionStorage, $scope, ingredientService) {

    $sessionStorage.search = $sessionStorage.search || {str: ''};
    $scope.search = $sessionStorage.search;

    $scope.errors = [];
    $scope.successMessage = null;

    $scope.ingredients = [];
    ingredientService.findAll()
      .then(function (data) {
        $scope.ingredients = data;
        $scope.filterIngredients();
      })
      .catch(function (error) {
        $scope.errors.push(error);
      });

    $scope.filteredIngredients = [];
    $scope.filterIngredients = function () {
      $scope.filteredIngredients = _.filter($scope.ingredients, function (ingredient) {
        return ingredient.name && ingredient.name.indexOf($scope.search.str) !== -1;
      });
    };

    $scope.addIngredient = function (ingredient) {
      if (_.includes(_.map($scope.ingredients, 'name'), ingredient.name)) {
        alert('This ingredient already exists');
        return;
      }

      $scope.errors = [];
      $scope.successMessage = null;

      ingredientService.create(ingredient)
        .then(function () {
          $scope.successMessage = 'Created ingredient';
          $scope.filterIngredients();
        })
        .catch(function (error) {
          $scope.errors.push(error);
        });
    };

  });