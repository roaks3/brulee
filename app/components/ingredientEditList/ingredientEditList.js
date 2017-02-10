'use strict';

class IngredientEditListCtrl {
}

angular.module('bruleeApp')
  .component('ingredientEditList', {
    bindings: {
      ingredients: '<',
      inputDisabled: '<',
      onRemove: '&'
    },
    controller: IngredientEditListCtrl,
    controllerAs: 'vm',
    templateUrl: 'components/ingredientEditList/ingredientEditList.html'
  });
