'use strict';

angular.module('bruleeApp.services')

  .service('groceryListService', function ($q, bruleeUtils, GroceryList, Ingredient, recipeService) {

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
        GroceryList.findAll(),
        recipeService.findAll(),
        Ingredient.findAll()
      ])
        .then(function (data) {
          var groceryLists = _.map(data[0], function (groceryList) {
            return _.assign(groceryList, {
              recipe_days: _.map(groceryList.recipe_days, function (recipe_day) {
                return _.assign(recipe_day, {
                  recipe: recipeService.get(recipe_day.recipe_id)
                });
              }),
              additional_ingredients: _.map(groceryList.additional_ingredients, function (additional_ingredient) {
                return _.assign(additional_ingredient, {
                  ingredient: Ingredient.get(additional_ingredient.ingredient_id)
                });
              })
            });
          });

          bruleeUtils.replaceEach(scope._groceryLists, groceryLists);
          bruleeUtils.replaceProperties(scope._groceryListsById, _.keyBy(scope._groceryLists, 'id'));

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
      var existingGroceryList = _.find(this._groceryLists, ['id', groceryList.id]);
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
        recipe_days: _.map(attrs.recipe_days, function (recipe_day) {
          return {
            recipe_id: recipe_day.recipe_id,
            day_of_week: recipe_day.day_of_week ? parseInt(recipe_day.day_of_week) : null
          };
        }),
        additional_ingredients: _.map(attrs.additional_ingredients, function (additional_ingredient) {
          return {
            ingredient_id: additional_ingredient.ingredient.id,
            amount: additional_ingredient.amount
          };
        })
      };
      var scope = this;

      return GroceryList.create(groceryList)
        .then(function (groceryList) {
          scope.inject(groceryList);
          return groceryList;
        });
    };

    this.update = function (groceryList) {
      var groceryListUpdate = {
        week_start: groceryList.week_start,
        recipe_days: _.map(groceryList.recipe_days, function (recipe_day) {
          return {
            recipe_id: recipe_day.recipe_id,
            day_of_week: recipe_day.day_of_week ? parseInt(recipe_day.day_of_week) : null
          };
        }),
        additional_ingredients: _.map(groceryList.additional_ingredients, function (additional_ingredient) {
          return {
            ingredient_id: additional_ingredient.ingredient.id,
            amount: additional_ingredient.amount
          };
        })
      };

      return GroceryList.update(groceryList.id, groceryListUpdate)
        .then(this.inject(groceryList));
    };

    return this;

  });
