'use strict';

angular.module('bruleeApp.services')

  .service('ingredientService', function ($q, bruleeUtils, ingredientFacade) {

    this.deferredIngredients = null;

    this._ingredients = [];
    this._ingredientsById = {};

    this.ejectAll = function () {
      this._ingredients = [];
      this._ingredientsById = {};
      this.deferredIngredients = null;
    };

    this.refreshAll = function () {
      this.deferredIngredients = $q.defer();
      var scope = this;

      ingredientFacade.ingredients()
        .then(function (data) {
          bruleeUtils.replaceEach(scope._ingredients, data);
          bruleeUtils.replaceProperties(scope._ingredientsById, _.keyBy(scope._ingredients, 'id'));

          scope.deferredIngredients.resolve();
        })
        .catch(function (error) {
          scope.deferredIngredients.reject(error);
        });

      return this.deferredIngredients.promise;
    };

    this.findAll = function () {
      var ingredientsPromise = this.deferredIngredients ? this.deferredIngredients.promise : this.refreshAll();
      var scope = this;

      return ingredientsPromise
        .then(function () {
          return scope._ingredients;
        });
    };

    this.get = function (id) {
      return this._ingredientsById[id];
    };

    this.getByName = function (name) {
      return _.find(this._ingredients, ['name', name]);
    };

    this.inject = function (ingredient) {
      var existingIngredient = _.find(this._ingredients, ['id', ingredient.id]);
      if (existingIngredient) {
        var updatedIngredient = _.clone(ingredient);
        _.defaults(updatedIngredient, existingIngredient);
        bruleeUtils.replaceProperties(existingIngredient, updatedIngredient);
      } else {
        this._ingredients.push(ingredient);
        this._ingredientsById[ingredient.id] = ingredient;
      }
    };

    this.create = function (attrs) {
      var ingredient = {
        name: attrs.name
      };
      var scope = this;

      return ingredientFacade.ingredientCreate(ingredient)
        .then(function (id) {
          ingredient.id = id;
          scope.inject(ingredient);
          return ingredient;
        });
    };

    this.update = function (ingredient) {
      var ingredientUpdate = {
        id: ingredient.id,
        name: ingredient.name
      };

      return ingredientFacade.ingredientUpdate(ingredientUpdate)
        .then(this.inject(ingredient));
    };

    this.eject = function (id) {
      oldlodash.remove(this._ingredients, 'id', id);
      delete this._ingredientsById[id];
    };

    this.destroy = function (id) {
      return ingredientFacade.ingredientDelete(id)
        .then(this.eject(id));
    };

    return this;

  });
