
'use strict';

angular.module('bruleeApp')

  .controller('AddRecipesCtrl', function ($q, $scope, categoryService, ingredientService, recipesService) {
    $scope.recipe = new Recipe('', null, '');
    $scope.isParsed = false;
    $scope.isSaved = false;
    $scope.isNameInvalid = false;

    $scope.errors = [];
    $scope.successMessage = null;

    $scope.categoryMap = {};
    $scope.items = [];
    $scope.categoryNames = [];
    $scope.categories = [];

    categoryService.findAll()
      .then(function (data) {
        $scope.categories = data;

        $scope.categoryNames = $scope.categories.map(function (category) {
          return category.name;
        });

        _.each($scope.categories, function (category) {
          _.each(category.ingredients, function (ingredient) {
            $scope.categoryMap[ingredient.name] = category.name;
            $scope.items.push(ingredient.name);
          });
        });
      })
      .catch(function (error) {
        $scope.errors.push(error);
      });

    // NOTE: With current implementation, first category wins
    $scope.addIngredientToCategory = function (ingredient, categoryName) {
      var category = _.find($scope.categories, 'name', categoryName);
      category.ingredients.push(ingredient);
      $scope.categoryMap[ingredient.name] = categoryName;
      $scope.items.push(ingredient.name);
    };

    $scope.addRecipe = function() {
      // Make sure there is a recipe name present
      if (!$scope.recipe.name) {
        $scope.isNameInvalid = true;
        return;
      }

      // Add ingredients to categories by name
      var ingredientsToCreate = [];
      var categoryNamesToUpdate = [];
      _.each($scope.recipe.recipe_ingredients, function (recipe_ingredient) {
        if (recipe_ingredient.selectedCategory && !$scope.isCategorized(recipe_ingredient)) {
          $scope.addIngredientToCategory(recipe_ingredient.ingredient, recipe_ingredient.selectedCategory);
          ingredientsToCreate.push(recipe_ingredient.ingredient);
          categoryNamesToUpdate.push(recipe_ingredient.selectedCategory);
        }
      });

      // Add all new ingredients
      $q.all(_.map(ingredientsToCreate, function (ingredient) {
        return ingredientService.create(ingredient);
      }))
        .then(function (data) {
          // Update categories with new ingredients
          var categoriesToUpdate = _.map(categoryNamesToUpdate, function (categoryName) {
            return _.find($scope.categories, 'name', categoryName);
          });
          return categoryService.updateAll(categoriesToUpdate);
        })
        .then(function () {
          return recipesService.recipeCreate($scope.recipe)
            .then(function () {
              $scope.isSaved = true;
            });
        })
        .catch(function (error) {
          console.log(error);
        });
    };

    $scope.parseRecipeText = function() {
      $scope.recipe.recipe_ingredients = Ingredients.parse($scope.recipe.original_text);
      $scope.isParsed = true;
    };

    $scope.removeIngredient = function (index) {
      $scope.recipe.recipe_ingredients.splice(index, 1);
    };

    $scope.getCategory = function (recipe_ingredient) {
      if (recipe_ingredient && recipe_ingredient.ingredient) {
        var item = $scope.categoryMap[recipe_ingredient.ingredient.name];
        if (item) {
          return $scope.categoryMap[recipe_ingredient.ingredient.name];
        }
      }
      return 'None';
    };

    $scope.isCategorized = function (recipe_ingredient) {
      if (recipe_ingredient && recipe_ingredient.ingredient) {
        var item = $scope.categoryMap[recipe_ingredient.ingredient.name];
        if (item) {
          return true;
        }
      }
      return false;
    };

    $scope.setSelectedCategory = function (recipe_ingredient, category) {
      recipe_ingredient.selectedCategory = category;
    };
  });
