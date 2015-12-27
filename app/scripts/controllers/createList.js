
'use strict';

angular.module('bruleeApp')

  .controller('CreateListCtrl', function ($q, $scope, $timeout, categoryService, groceryListFacade, ingredientService, recipeService) {
    
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
      groceryListFacade.groceryLists()
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
      var selectedRecipeIds = _(groceryList.recipe_days)
        .map(function (recipeDay) {
          return recipeDay.recipe_id
        })
        .value();

      _.each(selectedRecipeIds, function (recipeId) {
        var recipe = _.find($scope.recipes, 'id', recipeId);
        recipe._selected = true;
      });

      $scope.selectedGroceryList = groceryList;

      $scope.calculateShoppingList();
    };

    $scope.calculateShoppingList = function () {
      var selectedRecipes = _($scope.recipes)
        .filter('_selected')
        .value();

      var recipeNamesByIngredientId = _.reduce(selectedRecipes, function (memo, recipe) {
        _.each(recipe.recipe_ingredients, function(recipe_ingredient) {
          memo[recipe_ingredient.ingredient.id] = memo[recipe_ingredient.ingredient.id] || [];
          memo[recipe_ingredient.ingredient.id].push(recipe.name);
        });
        return memo;
      }, {});

      // Remove ingredients from the list that are not in the selected recipes
      $scope.shoppingList = _.map($scope.categories, function (category) {
        return {
          name: category.name,
          ingredients: _(category.ingredients)
            .filter(function (ingredient) {
              return recipeNamesByIngredientId[ingredient.id];
            })
            .value()
        };
      });

      // Gather ids for the uncategorized ingredients
      var leftoverIngredientIds = _.difference(
        _.keys(recipeNamesByIngredientId),
        _($scope.shoppingList)
          .map(function (category) {
            return _.pluck(category.ingredients, 'id');
          })
          .flatten()
          .value()
      );

      // Create leftover category for uncategorized ingredients
      $scope.shoppingList.push({
        name: 'Leftovers',
        ingredients: _.map(leftoverIngredientIds, function (ingredientId) {
          return ingredientService.get(ingredientId);
        })
      });

      // Add recipe names to each ingredient
      $scope.shoppingList = _.map($scope.shoppingList, function (category) {
        return {
          name: category.name,
          ingredients: _(category.ingredients)
            .map(function (ingredient) {
              return _.assign(ingredient, {
                recipes: recipeNamesByIngredientId[ingredient.id]
              });
            })
            .value()
        };
      });

      if (!$scope.selectedGroceryList) {
        $scope.newGroceryList = {
          week_start: moment().day(0).format('MM/DD'),
          recipe_days: _.map(selectedRecipes, function (recipe) {
            return {
              recipe_id: recipe.id
            };
          })
        };
      }
    };

    $scope.saveGroceryList = function () {
      var list = {
        week_start: $scope.newGroceryList.week_start,
        recipe_days: _.map($scope.newGroceryList.recipe_days, function (recipeDay) {
          return {
            recipe_id: recipeDay.recipe_id,
            day_of_week: recipeDay.day_of_week ? parseInt(recipeDay.day_of_week) : null
          };
        })
      };

      if ($scope.newGroceryList.id) {
        list.id = $scope.newGroceryList.id;
      }

      groceryListFacade.groceryListCreate(list);
    };
  });
