
'use strict';

angular.module('bruleeApp')

  .controller('CreateListCtrl', function ($q, $scope, $timeout, categoryEditorService, categoryService, ingredientService, recipesService) {
    
    $scope.recipes = [];

    $scope.refreshRecipes = function () {
      return $q.all([
        recipesService.recipes(),
        ingredientService.ingredients()
      ])
        .then(function (data) {
          var recipes = data[0];
          var ingredients = data[1];

          var ingredientsById = _.indexBy(ingredients, 'id');

          $scope.recipes = _.map(recipes, function (recipe) {
            return {
              name: recipe.name,
              originalText: recipe.original_text,
              ingredients: _.map(recipe.recipe_ingredients, function (recipeIngredient) {
                return {
                  item: ingredientsById[recipeIngredient.ingredient_id].name,
                  amount: recipeIngredient.amount
                };
              })
            };
          });
        });
    };

    $scope.categories = [];

    $scope.refreshCategories = function () {
      $scope.errors = [];
      $scope.successMessage = null;

      $scope.categories = [];
      categoryEditorService.categories()
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

    $scope.shoppingList = [];

    $scope.calculateShoppingList = function () {
      var selected = _($scope.recipes)
        .filter('_selected')
        .value();

      var itemRecipeMap = _.reduce(selected, function (memo, recipe) {
        _.each(recipe.ingredients, function(ingredient) {
          memo[ingredient.item] = memo[ingredient.item] || [];
          memo[ingredient.item].push(recipe.name);
        });
        return memo;
      }, {});

      $scope.shoppingList = _.map($scope.categories, function (category) {
        return {
          name: category.name,
          items: _(category.ingredients)
            .filter(function (ingredient) {
              return itemRecipeMap[ingredient.name];
            })
            .map(function (ingredient) {
              return {
                name: ingredient.name,
                recipes: itemRecipeMap[ingredient.name]
              };
            })
            .value()
        };
      });

      var leftoverList = _.difference(
        _.keys(itemRecipeMap),
        _.keys($scope.shoppingList)
      );

      $scope.shoppingList.push({
        name: 'Leftovers',
        items: _.map(leftoverList, function (item) {
          return {
            name: item,
            recipes: itemRecipeMap[item]
          };
        })
      });
    };
  });
