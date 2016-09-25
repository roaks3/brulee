'use strict';

class GroceryIngredientListCtrl {

  crossOut (ingredient) {
    if (this.crossedOut(ingredient)) {
      _.remove(this.crossedOutIngredients, (crossedOutIngredient) => {
        return crossedOutIngredient === ingredient.id;
      });
    } else {
      this.crossedOutIngredients.push(ingredient.id);
    }
  }

  crossedOut (ingredient) {
    return _.includes(this.crossedOutIngredients, ingredient.id);
  }

}

angular.module('bruleeApp')
  .component('groceryIngredientList', {
    bindings: {
      groceryIngredients: '<',
      crossedOutIngredients: '='
    },
    controller: GroceryIngredientListCtrl,
    controllerAs: 'vm',
    templateUrl: 'views/groceryIngredientList.html'
  });
