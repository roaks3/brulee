'use strict';

class GroceryIngredientListItemCtrl {

  toggle () {
    this.isExpanded = !this.isExpanded;
  }

}

angular.module('bruleeApp')
  .component('groceryIngredientListItem', {
    bindings: {
      groceryIngredient: '<',
      isCrossedOut: '<',
      onCrossOut: '&'
    },
    controller: GroceryIngredientListItemCtrl,
    templateUrl: 'views/groceryIngredientListItem.html'
  });
