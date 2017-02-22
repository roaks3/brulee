import angular from 'angular';

import template from './ingredientEditList.html';
import './ingredientEditList.scss';

class IngredientEditListCtrl {
}

export default angular.module('components.ingredientEditList', [])
  .component('ingredientEditList', {
    template,
    bindings: {
      ingredients: '<',
      inputDisabled: '<',
      onRemove: '&'
    },
    controller: IngredientEditListCtrl,
    controllerAs: 'vm'
  })
  .name;
