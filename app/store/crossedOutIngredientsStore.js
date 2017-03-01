import angular from 'angular';

class CrossedOutIngredientsStore {

  constructor ($window) {
    'ngInject';

    this.$window = $window;
  }

  fetchCrossedOutIngredients () {
    this.crossedOutIngredientIds = JSON.parse(this.$window.localStorage.getItem('crossedOutIngredientIds')) || [];
  }

  toggleCrossedOutIngredient (ingredientId) {
    if (this.crossedOutIngredientIds.includes(ingredientId)) {
      this.crossedOutIngredientIds =
        this.crossedOutIngredientIds.filter(crossedOutIngredientId => crossedOutIngredientId !== ingredientId);
    } else {
      this.crossedOutIngredientIds = [...this.crossedOutIngredientIds, ingredientId];
    }
    this.$window.localStorage.setItem('crossedOutIngredientIds', JSON.stringify(this.crossedOutIngredientIds));
  }

  clearCrossedOutIngredients () {
    this.crossedOutIngredientIds = [];
    this.$window.localStorage.setItem('crossedOutIngredientIds', JSON.stringify(this.crossedOutIngredientIds));
  }

  selectAllCrossedOutIngredientIds () {
    return this.crossedOutIngredientIds;
  }

}

export default angular.module('services.crossedOutIngredientsStore', [])
  .service('crossedOutIngredientsStore', CrossedOutIngredientsStore)
  .name;
