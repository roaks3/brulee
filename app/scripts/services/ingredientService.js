import angular from 'angular';

import Ingredient from '../datastores/Ingredient';

export default angular.module('services.ingredientService', [Ingredient])

  .service('ingredientService', function (Ingredient) {
    'ngInject';

    this.getByName = function (name) {
      return _.head(Ingredient.filter({name}));
    };

    this.findAllIngredientsByName = names =>
      Ingredient.findAll({ names });

    return this;

  })
  .name;
