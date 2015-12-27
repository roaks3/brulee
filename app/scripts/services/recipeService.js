'use strict';

angular.module('bruleeApp.services')

  .service('recipeService', function ($q, bruleeUtils, recipeFacade, ingredientService) {

    this.deferredRecipes = null;

    this._recipes = [];
    this._recipesById = {};

    this.ejectAll = function () {
      this._recipes = [];
      this._recipesById = {};
      this.deferredRecipes = null;
    };

    this.refreshAll = function () {
      this.deferredRecipes = $q.defer();
      var scope = this;

      $q.all([
        recipeFacade.recipes(),
        ingredientService.findAll()
      ])
        .then(function (data) {
          var recipes = _.map(data[0], function (recipe) {
            return _.assign(recipe, {
              recipe_ingredients: _.map(recipe.recipe_ingredients, function (recipeIngredient) {
                return _.assign(recipeIngredient, {
                  ingredient: ingredientService.get(recipeIngredient.ingredient_id)
                });
              })
            });
          });

          bruleeUtils.replaceEach(scope._recipes, recipes);
          bruleeUtils.replaceProperties(scope._recipesById, _.indexBy(scope._recipes, 'id'));

          scope.deferredRecipes.resolve();
        })
        .catch(function (error) {
          scope.deferredRecipes.reject(error);
        });

      return this.deferredRecipes.promise;
    };

    this.findAll = function () {
      var recipesPromise = this.deferredRecipes ? this.deferredRecipes.promise : this.refreshAll();
      var scope = this;

      return recipesPromise
        .then(function () {
          return scope._recipes;
        });
    };

    this.inject = function (recipe) {
      var existingRecipe = _.find(this._recipes, 'id', recipe.id);
      if (existingRecipe) {
        bruleeUtils.replaceProperties(existingRecipe, recipe);
      } else {
        this._recipes.push(recipe);
        this._recipesById[recipe.id] = recipe;
      }
    };

    this.create = function (attrs) {
      var recipe = {
        name: attrs.name,
        original_text: attrs.original_text,
        url: attrs.url,
        recipe_ingredients: _.map(attrs.recipe_ingredients, function (recipe_ingredient) {
          return {
            ingredient_id: recipe_ingredient.ingredient.id,
            amount: recipe_ingredient.amount
          };
        })
      };
      var scope = this;

      return recipeFacade.recipeCreate(recipe)
        .then(function (id) {
          recipe.id = id;
          scope.inject(recipe);
          return recipe;
        });
    };

    return this;

  });
