'use strict';

angular.module('bruleeApp')

  .controller('IngredientListCtrl', function ($sessionStorage, $scope, Ingredient) {

    $sessionStorage.search = $sessionStorage.search || {str: ''};
    $scope.search = $sessionStorage.search;

    $scope.errors = [];
    $scope.successMessage = null;

    $scope.ingredients = [];
    Ingredient.refreshAll()
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
        return ingredient.name && ingredient.name.toLowerCase().indexOf($scope.search.str.toLowerCase()) !== -1;
      });
    };

    $scope.addIngredient = function (ingredient) {
      if (_.includes(_.map($scope.ingredients, 'name'), ingredient.name)) {
        alert('This ingredient already exists');
        return;
      }

      $scope.errors = [];
      $scope.successMessage = null;

      Ingredient.create({name: ingredient.name})
        .then(function () {
          $scope.successMessage = 'Created ingredient';
          $scope.ingredients = Ingredient.filter();
          $scope.filterIngredients();
        })
        .catch(function (error) {
          $scope.errors.push(error);
        });
    };

  });
