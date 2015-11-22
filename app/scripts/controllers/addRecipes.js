
'use strict';

angular.module('bruleeApp')

  .controller('AddRecipesCtrl', function ($q, $scope, categoryService, ingredientService, recipesService) {
    $scope.recipe = new Recipe('', null, '');
    $scope.isParsed = false;
    $scope.isSaved = false;
    $scope.isNameInvalid = false;

    $scope.categoryMap = {};
    $scope.items = [];
    $scope.categoryNames = [];
    $scope.categories = [];

    $q.all([
      categoryService.categories(),
      ingredientService.ingredients()
    ])
      .then(function (data) {
        var categories = data[0];
        var ingredients = data[1];

        var ingredientsById = _.indexBy(ingredients, 'id');

        $scope.categories = _.map(categories, function (category) {
          return {
            name: category.name,
            order: category.order,
            items: _.map(category.ingredient_ids, function (ingredientId) {
              return ingredientsById[ingredientId].name;
            }),
            ingredients: _.map(category.ingredient_ids, function (ingredientId) {
              return ingredientsById[ingredientId];
            })
          };
        });

        $scope.categoryNames = categories.map(function (category) {
          return category.name;
        });

        _.each($scope.categories, function (category) {
          _.each(category.ingredients, function (ingredient) {
            $scope.categoryMap[ingredient.name] = category.name;
            $scope.items.push(ingredient.name);
          });
        });
      });

    $scope.addRecipe = function() {
      // Make sure there is a recipe name present
      if (!$scope.recipe.name) {
        $scope.isNameInvalid = true;
        return;
      }

      $scope.isNameInvalid = false;
      angular.forEach($scope.recipe.ingredients, function (ingredient) {
        if (ingredient.selectedCategory) {
          // Do not add if it already belongs to a category
          if (!$scope.isCategorized(ingredient)) {
            $scope.categoryMap[ingredient.item] = ingredient.selectedCategory;
            $scope.items.push(ingredient.item);
            angular.forEach($scope.categories, function (category) {
              if (category.name === ingredient.selectedCategory) {
                category.items.push(ingredient.item);
              }
            });
          }
          // Do not save the selectedCategory in the database
          delete ingredient['selectedCategory'];
        }
      });

      categoryService.categoryUpdateBulk($scope.categories);

      recipesService.recipeCreate($scope.recipe)
        .then(function () {
          $scope.isSaved = true;
        });
    };

    $scope.parseRecipeText = function() {
      $scope.recipe.ingredients = Ingredients.parse($scope.recipe.originalText);
      $scope.isParsed = true;
    };

    $scope.removeIngredient = function(index) {
      $scope.recipe.ingredients.splice(index, 1);
    };

    $scope.getCategory = function(ingredient) {
      if (ingredient) {
        var item = $scope.categoryMap[ingredient.item];
        if (item) {
          return $scope.categoryMap[ingredient.item];
        }
      }
      return 'None';
    };

    $scope.isCategorized = function(ingredient) {
      if (ingredient) {
        var item = $scope.categoryMap[ingredient.item];
        if (item) {
          return true;
        }
      }
      return false;
    };

    $scope.setSelectedCategory = function(ingredient, category) {
      ingredient.selectedCategory = category;
    };
  });
