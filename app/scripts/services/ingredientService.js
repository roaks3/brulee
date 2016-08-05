'use strict';

angular.module('bruleeApp.services')

  .service('ingredientService', function ($q, bruleeUtils, Ingredient) {

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

      Ingredient.findAll()
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
      var scope = this;

      return Ingredient
        .create({
          name: attrs.name
        })
        .then(function (ingredient) {
          scope.inject(ingredient);
          return ingredient;
        });
    };

    this.update = function (ingredient) {
      return Ingredient
        .update(ingredient.id, {
          name: ingredient.name
        })
        .then(this.inject(ingredient));
    };

    this.eject = function (id) {
      _.remove(this._ingredients, ['id', id]);
      delete this._ingredientsById[id];
    };

    this.destroy = function (id) {
      return Ingredient.destroy(id)
        .then(this.eject(id));
    };

    return this;

  });
