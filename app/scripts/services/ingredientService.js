import angular from 'angular';

import Ingredient from '../datastores/Ingredient';

export default angular.module('services.ingredientService', [Ingredient])

  .service('ingredientService', function (Ingredient) {
    'ngInject';

    this.getByName = function (name) {
      return _.head(Ingredient.filter({name}));
    };

    this.findAllIngredientsByName = (names) => {
      return Ingredient
        .findAll({
          q: {
            name: {
              '$in': names
            }
          }
        });
    };

    return this;

  })
  .name;
