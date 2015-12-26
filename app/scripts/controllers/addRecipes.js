
'use strict';

angular.module('bruleeApp')

  .controller('AddRecipesCtrl', function ($q, $scope, categoryService, ingredientService, recipeFacade) {
    $scope.recipe = new Recipe('', null, '');
    $scope.isParsed = false;
    $scope.isSaved = false;
    $scope.isNameInvalid = false;

    $scope.errors = [];
    $scope.successMessage = null;

    $scope.categoryMap = {};
    $scope.ingredients = [];
    $scope.categoryNames = [];
    $scope.categories = [];

    ingredientService.findAll()
      .then(function (data) {
        $scope.ingredients = data;
      });

    categoryService.findAll()
      .then(function (data) {
        $scope.categories = data;

        $scope.categoryNames = $scope.categories.map(function (category) {
          return category.name;
        });

        _.each($scope.categories, function (category) {
          _.each(category.ingredients, function (ingredient) {
            $scope.categoryMap[ingredient.name] = category.name;
          });
        });
      })
      .catch(function (error) {
        $scope.errors.push(error);
      });

    $scope.createNewIngredients = function (recipe) {
      var ingredientsToCreate = _(recipe.recipe_ingredients)
        .pluck('ingredient')
        .reject('id')
        .value();

      return $q.all(_.map(ingredientsToCreate, function (ingredient) {
        return ingredientService.create(ingredient);
      }));
    };

    $scope.updateCategories = function (recipe) {
      var categoriesToUpdate = [];

      _.each(recipe.recipe_ingredients, function (recipe_ingredient) {
        if (recipe_ingredient.selectedCategory && !$scope.isCategorized(recipe_ingredient)) {
          var category = categoryService.getByName(recipe_ingredient.selectedCategory);
          var ingredient = ingredientService.getByName(recipe_ingredient.ingredient.name);
          
          $scope.categoryMap[recipe_ingredient.ingredient.name] = recipe_ingredient.selectedCategory;
          category.ingredients.push(ingredient);
          categoriesToUpdate.push(category);
        }
      });

      return categoryService.updateAll(categoriesToUpdate);
    };

    $scope.updateRecipeIngredients = function (recipe) {
      _.each(recipe.recipe_ingredients, function (recipe_ingredient) {
        recipe_ingredient.ingredient = ingredientService.getByName(recipe_ingredient.ingredient.name);
      });
    };

    $scope.addRecipe = function() {
      // Make sure there is a recipe name present
      if (!$scope.recipe.name) {
        $scope.isNameInvalid = true;
        return;
      }

      $scope.createNewIngredients($scope.recipe)
        .then(function () {
          return $scope.updateCategories($scope.recipe);
        })
        .then(function () {
          return $scope.updateRecipeIngredients($scope.recipe);
        })
        .then(function () {
          return recipeFacade.recipeCreate($scope.recipe)
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

      _.each($scope.recipe.recipe_ingredients, function (recipe_ingredient) {
        var existingIngredient = ingredientService.getByName(recipe_ingredient.ingredient.name);
        if (existingIngredient) {
          recipe_ingredient.ingredient = existingIngredient;
        }
      });

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
