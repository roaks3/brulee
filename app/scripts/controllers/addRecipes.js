
'use strict';

angular.module('bruleeApp')

  .controller('AddRecipesCtrl', function ($q, $scope, Category, categoryService, Ingredient, ingredientParseService, ingredientService, recipeService) {
    $scope.recipe = {
      name: '',
      ingredients: [],
      originalText: ''
    };
    $scope.isParsed = false;
    $scope.isSaved = false;
    $scope.isNameInvalid = false;

    $scope.errors = [];
    $scope.successMessage = null;

    Category.refreshAll()
      .catch(function (error) {
        $scope.errors.push(error);
      });

    $scope.createNewIngredients = function (recipe) {
      var ingredientsToCreate = _(recipe.recipe_ingredients)
        .map('ingredient')
        .reject('id')
        .value();

      return $q.all(_.map(ingredientsToCreate, function (ingredient) {
        return Ingredient.create({name: ingredient.name});
      }));
    };

    $scope.updateCategories = function (recipe) {
      var categoriesToUpdate = [];

      _.each(recipe.recipe_ingredients, function (recipe_ingredient) {
        if (recipe_ingredient.selectedCategory && !$scope.isCategorized(recipe_ingredient)) {
          var category = recipe_ingredient.selectedCategory;
          var ingredient = ingredientService.getByName(recipe_ingredient.ingredient.name);

          category.ingredient_ids.push(ingredient.id);
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
          return recipeService.create($scope.recipe)
            .then(function () {
              $scope.isSaved = true;
            });
        })
        .catch(function (error) {
          console.log(error);
        });
    };

    $scope.parseRecipeText = function() {
      $scope.recipe.recipe_ingredients = ingredientParseService.parseAll($scope.recipe.original_text);

      _.each($scope.recipe.recipe_ingredients, function (recipe_ingredient) {
        var existingIngredient = ingredientService.getByName(recipe_ingredient.ingredient.name);
        if (existingIngredient) {
          recipe_ingredient.ingredient = existingIngredient;
        }

        recipe_ingredient.selectedCategory = categoryService.getByIngredientId(recipe_ingredient.ingredient.id);
      });

      $scope.isParsed = true;
    };

    $scope.removeRecipeIngredient = function (recipeIngredient) {
      _.remove($scope.recipe.recipe_ingredients, function (recipe_ingredient) {
        return recipe_ingredient === recipeIngredient;
      });
    };

    $scope.isCategorized = function (recipe_ingredient) {
      // TODO: This should probably use some other field to reflect whether the
      // selected category needs to be saved
      if (recipe_ingredient && recipe_ingredient.ingredient) {
        return !!categoryService.getByIngredientId(recipe_ingredient.ingredient.id);
      }
      return false;
    };

  });
