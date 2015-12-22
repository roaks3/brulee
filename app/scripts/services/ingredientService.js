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
          bruleeUtils.replaceProperties(scope._ingredientsById, _.indexBy(scope._ingredients, 'id'));

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

    return this;

  });
