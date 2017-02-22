import angular from 'angular';

import groceryIngredientListItem from '../groceryIngredientListItem/groceryIngredientListItem';

import template from './groceryIngredientList.html';

class GroceryIngredientListCtrl {

  crossedOut (ingredient) {
    return _.includes(this.crossedOutIngredients, ingredient.id);
  }

}

export default angular.module('components.groceryIngredientList', [groceryIngredientListItem])
  .component('groceryIngredientList', {
    template,
    bindings: {
      ingredients: '<',
      crossedOutIngredients: '<',
      onCrossOut: '&'
    },
    controller: GroceryIngredientListCtrl
  })
  .name;
