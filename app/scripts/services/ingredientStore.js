'use strict';

class IngredientStore {

  constructor (Ingredient) {
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

angular.module('bruleeApp.services')
  .service('ingredientStore', IngredientStore);
