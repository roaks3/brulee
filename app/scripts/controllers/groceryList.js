'use strict';

angular.module('bruleeApp')

  .controller('GroceryListCtrl', function ($scope, $stateParams, $localStorage,
                                           GroceryList, groceryIngredientService) {

    $scope.groceryLists = [];
    $scope.groceryList = {};
    $scope.errors = [];

    $localStorage.crossedOutIngredients = $localStorage.crossedOutIngredients || [];
    $scope.crossedOutIngredients = $localStorage.crossedOutIngredients;

    $scope.init = function () {
      return $scope
        .refreshGroceryLists()
        .catch((error) => {
          $scope.errors.push(error);
        });
    };

    $scope.refreshGroceryLists = function () {
      $scope.errors = [];
      $scope.groceryLists = [];

      return GroceryList
        .refreshAll()
        .then(function (data) {
          $scope.groceryLists = _.sortBy(data, 'week_start');

          if ($stateParams.id) {
            $scope.selectGroceryList($stateParams.id);
          }
        })
        .catch(function (error) {
          $scope.errors.push(error);
        });
    };

    $scope.init();

    $scope.selectGroceryList = function (id) {
      $scope.groceryList = _.find($scope.groceryLists, ['id', id]);
      if ($scope.groceryList) {
        $scope.groceryList.recipe_days = _.sortBy($scope.groceryList.recipe_days, 'day_of_week');
        groceryIngredientService
          .generate($scope.groceryList)
          .then((data) => {
            $scope.groceryIngredients = data;
          });
      } else {
        $scope.groceryList = {};
        $scope.groceryIngredients = {};
      }
    };

    $scope.addIngredient = function (ingredient) {
      $scope.groceryList.additional_ingredients = $scope.groceryList.additional_ingredients || [];
      $scope.groceryList.additional_ingredients.push({
        ingredient_id: ingredient.id,
        amount: 1
      });

      GroceryList
        .update($scope.groceryList.id, {
          week_start: $scope.groceryList.week_start,
          recipe_days: $scope.groceryList.recipe_days,
          additional_ingredients: $scope.groceryList.additional_ingredients
        })
        .then(function () {
          // TODO: Can probably come up with a less naive solution
          $scope.refreshGroceryLists();
        });
    };

    $scope.crossOut = function (ingredient) {
      if (_.includes($scope.crossedOutIngredients, ingredient.id)) {
        _.pull($scope.crossedOutIngredients, ingredient.id);
      } else {
        $scope.crossedOutIngredients.push(ingredient.id);
      }
    };

    $scope.clearCrossedOutIngredients = function () {
      $localStorage.crossedOutIngredients = [];
      $scope.crossedOutIngredients = $localStorage.crossedOutIngredients;
    };

  });
