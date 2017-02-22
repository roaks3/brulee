import angular from 'angular';

import Ingredient from '../datastores/Ingredient';

class IngredientStore {

  constructor (Ingredient) {
    'ngInject';

    this.Ingredient = Ingredient;
  }

  fetchAllIngredients () {
    return this.Ingredient
      .findAll()
      .then(ingredients => {
        this.allIngredients = ingredients;
      });
  }

  selectIngredientsBySearchTerm (searchTerm) {
    return this.allIngredients.filter(ingredient => ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }

}

export default angular.module('services.ingredientStore', [Ingredient])
  .service('ingredientStore', IngredientStore)
  .name;
