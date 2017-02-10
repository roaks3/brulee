'use strict';

class GroceryIngredientListCtrl {

  crossedOut (ingredient) {
    return _.includes(this.crossedOutIngredients, ingredient.id);
  }

}

angular.module('bruleeApp')
  .component('groceryIngredientList', {
    bindings: {
      ingredients: '<',
      crossedOutIngredients: '<',
      onCrossOut: '&'
    },
    controller: GroceryIngredientListCtrl,
    templateUrl: 'components/groceryIngredientList/groceryIngredientList.html'
  });
