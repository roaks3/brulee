'use strict';

angular.module('bruleeApp.services')

  .service('groceryListService', function ($q, bruleeUtils, groceryListFacade, ingredientService, recipeService) {

    this.deferredGroceryLists = null;

    this._groceryLists = [];
    this._groceryListsById = {};

    this.ejectAll = function () {
      this._groceryLists = [];
      this._groceryListsById = {};
      this.deferredGroceryLists = null;
    };

    this.refreshAll = function () {
      this.deferredGroceryLists = $q.defer();
      var scope = this;

      $q.all([
        groceryListFacade.groceryLists(),
        recipeService.findAll(),
        ingredientService.findAll()
      ])
        .then(function (data) {
          var groceryLists = oldlodash.map(data[0], function (groceryList) {
            return oldlodash.assign(groceryList, {
              recipe_days: oldlodash.map(groceryList.recipe_days, function (recipe_day) {
                return oldlodash.assign(recipe_day, {
                  recipe: recipeService.get(recipe_day.recipe_id)
                });
              }),
              additional_ingredients: oldlodash.map(groceryList.additional_ingredients, function (additional_ingredient) {
                return oldlodash.assign(additional_ingredient, {
                  ingredient: ingredientService.get(additional_ingredient.ingredient_id)
                });
              })
            });
          });

          bruleeUtils.replaceEach(scope._groceryLists, groceryLists);
          bruleeUtils.replaceProperties(scope._groceryListsById, oldlodash.indexBy(scope._groceryLists, 'id'));

          scope.deferredGroceryLists.resolve();
        })
        .catch(function (error) {
          scope.deferredGroceryLists.reject(error);
        });

      return this.deferredGroceryLists.promise;
    };

    this.findAll = function () {
      var groceryListsPromise = this.deferredGroceryLists ? this.deferredGroceryLists.promise : this.refreshAll();
      var scope = this;

      return groceryListsPromise
        .then(function () {
          return scope._groceryLists;
        });
    };

    this.inject = function (groceryList) {
      var existingGroceryList = oldlodash.find(this._groceryLists, 'id', groceryList.id);
      if (existingGroceryList) {
        var updatedGroceryList = _.clone(groceryList);
        _.defaults(updatedGroceryList, existingGroceryList);
        bruleeUtils.replaceProperties(existingGroceryList, updatedGroceryList);
      } else {
        this._groceryLists.push(groceryList);
        this._groceryListsById[groceryList.id] = groceryList;
      }
    };

    this.create = function (attrs) {
      var groceryList = {
        week_start: attrs.week_start,
        recipe_days: oldlodash.map(attrs.recipe_days, function (recipe_day) {
          return {
            recipe_id: recipe_day.recipe_id,
            day_of_week: recipe_day.day_of_week ? parseInt(recipe_day.day_of_week) : null
          };
        }),
        additional_ingredients: oldlodash.map(attrs.additional_ingredients, function (additional_ingredient) {
          return {
            ingredient_id: additional_ingredient.ingredient.id,
            amount: additional_ingredient.amount
          };
        })
      };
      var scope = this;

      return groceryListFacade.groceryListCreate(groceryList)
        .then(function (id) {
          groceryList.id = id;
          scope.inject(groceryList);
          return groceryList;
        });
    };

    this.update = function (groceryList) {
      var groceryListUpdate = {
        id: groceryList.id,
        recipe_days: oldlodash.map(groceryList.recipe_days, function (recipe_day) {
          return {
            recipe_id: recipe_day.recipe_id,
            day_of_week: recipe_day.day_of_week ? parseInt(recipe_day.day_of_week) : null
          };
        }),
        additional_ingredients: oldlodash.map(groceryList.additional_ingredients, function (additional_ingredient) {
          return {
            ingredient_id: additional_ingredient.ingredient.id,
            amount: additional_ingredient.amount
          };
        })
      };

      return groceryListFacade.groceryListUpdate(groceryListUpdate)
        .then(this.inject(groceryList));
    };

    return this;

  });
