'use strict';

class IngredientEditListCtrl {
}

angular.module('bruleeApp')
  .component('ingredientEditList', {
    bindings: {
      ingredients: '<',
      onRemove: '&'
    },
    controller: IngredientEditListCtrl,
    controllerAs: 'vm',
    templateUrl: 'views/ingredientEditList.html'
  });
