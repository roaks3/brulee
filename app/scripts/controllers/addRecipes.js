
'use strict';

angular.module('bruleeApp')

  .controller('AddRecipesCtrl', function ($q, $scope, Category, categoryService,
                                          Ingredient, ingredientParseService,
                                          ingredientService, Recipe) {

    $scope.recipe = {};
    $scope.isParsed = false;
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
            .create(_.assign(
              _.pick($scope.recipe, ['name', 'original_text', 'url']),
              {
                recipe_ingredients: _.map($scope.recipe.recipe_ingredients, function (recipeIngredient) {
                  return {
                    ingredient_id: recipeIngredient.ingredient.id,
                    amount: recipeIngredient.amount
                  };
                })
              }
            ))
            .then(function () {
              $scope.successMessage = 'Recipe saved!';
            });
        })
        .catch(function (error) {
          $scope.errors.push(error);
        });
    };

    $scope.parseRecipeText = function () {
      let recipeIngredients = ingredientParseService.parseAll($scope.recipe.original_text);

      let ingredientNames = _(recipeIngredients)
        .map('ingredient.name')
        .uniq()
        .value();

      ingredientService
        .findAllIngredientsByName(ingredientNames)
        .then(() => {
          _.each(recipeIngredients, function (recipeIngredient) {
            var existingIngredient = ingredientService.getByName(recipeIngredient.ingredient.name);
            if (existingIngredient) {
              recipeIngredient.ingredient = existingIngredient;
            }

            recipeIngredient.selectedCategory = categoryService.getByIngredientId(recipeIngredient.ingredient.id);
          });

          $scope.recipe.recipe_ingredients = recipeIngredients;
          $scope.isParsed = true;
        });
    };

    $scope.removeRecipeIngredient = (recipeIngredient) => {
      _.pull($scope.recipe.recipe_ingredients, recipeIngredient);
    };

    $scope.isCategorized = function (recipeIngredient) {
      // TODO: This should probably use some other field to reflect whether the
      // selected category needs to be saved
      if (recipeIngredient && recipeIngredient.ingredient) {
        return !!categoryService.getByIngredientId(recipeIngredient.ingredient.id);
      }
      return false;
    };

    $scope.updateRecipeIngredient = (recipeIngredient, ingredient) => {
      recipeIngredient.ingredient = ingredient || null;
    };

    $scope.updateRecipeIngredientCategory = (recipeIngredient, category) => {
      recipeIngredient.selectedCategory = category || null;
    };

  });
