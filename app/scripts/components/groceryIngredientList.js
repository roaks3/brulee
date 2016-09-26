'use strict';

class GroceryIngredientListCtrl {

  crossedOut (ingredient) {
    return _.includes(this.crossedOutIngredients, ingredient.id);
  }

}

angular.module('bruleeApp')
  .component('groceryIngredientList', {
    bindings: {
      groceryIngredients: '<',
      crossedOutIngredients: '<',
      onCrossOut: '&'
    },
    controller: GroceryIngredientListCtrl,
    controllerAs: 'vm',
    templateUrl: 'views/groceryIngredientList.html'
  });
