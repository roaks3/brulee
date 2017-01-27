'use strict';

class GroceryCategoryListItemCtrl {
}

angular.module('bruleeApp')
  .component('groceryCategoryListItem', {
    bindings: {
      categoryIngredients: '<',
      crossedOutIngredients: '<',
      onCrossOut: '&'
    },
    controller: GroceryCategoryListItemCtrl,
    templateUrl: 'views/groceryCategoryListItem.html'
  });
