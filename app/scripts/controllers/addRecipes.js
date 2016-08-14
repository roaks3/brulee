
'use strict';

angular.module('bruleeApp')

  .controller('AddRecipesCtrl', function ($q, $scope, Category, categoryService,
                                          Ingredient, ingredientParseService,
                                          ingredientService, Recipe) {

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

      _.each(recipe.recipe_ingredients, function (recipeIngredient) {
        if (recipeIngredient.selectedCategory && !$scope.isCategorized(recipeIngredient)) {
          var category = recipeIngredient.selectedCategory;
          var ingredient = ingredientService.getByName(recipeIngredient.ingredient.name);

          category.ingredient_ids.push(ingredient.id);
          categoriesToUpdate.push(category);
        }
      });

      return categoryService.updateAll(categoriesToUpdate);
    };

    $scope.updateRecipeIngredients = function (recipe) {
      _.each(recipe.recipe_ingredients, function (recipeIngredient) {
        recipeIngredient.ingredient = ingredientService.getByName(recipeIngredient.ingredient.name);
      });
    };

    $scope.addRecipe = function () {
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
          return Recipe
            .create({
              name: $scope.recipe.name,
              original_text: $scope.recipe.original_text,
              url: $scope.recipe.url,
              recipe_ingredients: _.map($scope.recipe.recipe_ingredients, function (recipeIngredient) {
                return {
                  ingredient_id: recipeIngredient.ingredient.id,
                  amount: recipeIngredient.amount
                };
              })
            })
            .then(function () {
              $scope.isSaved = true;
            });
        })
        .catch(function (error) {
          console.log(error);
        });
    };

    $scope.parseRecipeText = function () {
      $scope.recipe.recipe_ingredients = ingredientParseService.parseAll($scope.recipe.original_text);

      _.each($scope.recipe.recipe_ingredients, function (recipeIngredient) {
        var existingIngredient = ingredientService.getByName(recipeIngredient.ingredient.name);
        if (existingIngredient) {
          recipeIngredient.ingredient = existingIngredient;
        }

        recipeIngredient.selectedCategory = categoryService.getByIngredientId(recipeIngredient.ingredient.id);
      });

      $scope.isParsed = true;
    };

    $scope.removeRecipeIngredient = function (recipeIngredient) {
      _.remove($scope.recipe.recipe_ingredients, function (existingRecipeIngredient) {
        return existingRecipeIngredient === recipeIngredient;
      });
    };

    $scope.isCategorized = function (recipeIngredient) {
      // TODO: This should probably use some other field to reflect whether the
      // selected category needs to be saved
      if (recipeIngredient && recipeIngredient.ingredient) {
        return !!categoryService.getByIngredientId(recipeIngredient.ingredient.id);
      }
      return false;
    };

  });
