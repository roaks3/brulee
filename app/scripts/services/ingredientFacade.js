'use strict';

angular.module('bruleeApp.services')

  .factory('Ingredient', function (bruleeDataService, DS) {

    return DS.defineResource(_.assign({
      name: 'ingredient',
      endpoint: 'ingredients'
    }, bruleeDataService.jsDataConfig));

  })

  .service('ingredientFacade', function (Ingredient) {

    this.ingredients = function () {
      return Ingredient.findAll();
    };

    this.ingredientCreate = function (ingredient) {
      return Ingredient.create({
        name: ingredient.name
      });
    };

    this.ingredientUpdate = function (ingredient) {
      return Ingredient.update(ingredient.id, {
        name: ingredient.name
      });
    };

    this.ingredientDelete = function (ingredientId) {
      return Ingredient.destroy(ingredientId);
    };

    return this;

  });
