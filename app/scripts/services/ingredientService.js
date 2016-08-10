'use strict';

angular.module('bruleeApp.services')

  .service('ingredientService', function (Ingredient) {

    this.getByName = function (name) {
      return _.head(Ingredient.filter({name}));
    };

    return this;

  });
