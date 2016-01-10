
'use strict';

angular.module('bruleeApp')

  .controller('CreateListCtrl', function ($filter, $q, $scope, $timeout, categoryService,
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

    $scope.groceryLists = [];

    $scope.refreshGroceryLists = function () {
      $scope.errors = [];
      $scope.successMessage = null;

      $scope.groceryLists = [];
      groceryListService.findAll()
        .then(function (data) {
          $scope.groceryLists = data;
        })
        .catch(function (error) {
          $scope.errors.push(error);
        });
    };

    $scope.refreshRecipes();

    $timeout(function () {
      $scope.refreshCategories();
    }, 1000);

    $timeout(function () {
      $scope.refreshGroceryLists();
    }, 1500);

    $scope.shoppingList = [];

    $scope.selectGroceryList = function (id) {
      var groceryList = _.find($scope.groceryLists, 'id', id);
      var selectedRecipeIds = _.map(groceryList.recipe_days, 'recipe_id');

      _.each(selectedRecipeIds, function (recipeId) {
        var recipe = _.find($scope.recipes, 'id', recipeId);
        recipe._selected = true;
      });

      $scope.shoppingList = $filter('groceryListFilter')(groceryList);
    };

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
