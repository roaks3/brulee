
'use strict';

angular.module('bruleeApp')

  .controller('CreateListCtrl', function ($filter, $q, $scope, $sessionStorage, $timeout, categoryService,
    groceryListService, ingredientService, recipeService) {
    
    $scope.recipes = [];
    $scope.refreshRecipes = function () {
      return recipeService.findAll()
        .then(function (data) {
          $scope.recipes = data;
        });
    };

    $scope.categories = [];
    $scope.refreshCategories = function () {
      $scope.errors = [];
      $scope.successMessage = null;

      $scope.categories = [];
      categoryService.findAll()
        .then(function (data) {
          $scope.categories = data;
        })
        .catch(function (error) {
          $scope.errors.push(error);
        });
    };

    $scope.refreshRecipes();

    $timeout(function () {
      $scope.refreshCategories();
    }, 1000);

    $sessionStorage.crossedOutIngredients = $sessionStorage.crossedOutIngredients || [];
    $scope.crossedOutIngredients = $sessionStorage.crossedOutIngredients;

    $scope.shoppingList = [];

    $scope.calculateShoppingList = function () {
      var selectedRecipes = _($scope.recipes)
        .filter('_selected')
        .value();

      $scope.newGroceryList = {
        week_start: moment().day(0).format('MM/DD'),
        recipe_days: _.map(selectedRecipes, function (recipe) {
          return {
            recipe_id: recipe.id
          };
        })
      };

      $scope.shoppingList = $filter('groceryListFilter')($scope.newGroceryList);
    };

    $scope.saveGroceryList = function () {
      if ($scope.newGroceryList.id) {
        //groceryListService.update($scope.newGroceryList);
      } else {
        groceryListService.create($scope.newGroceryList);
      }
    };
  });
