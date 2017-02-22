import angular from 'angular';

import groceryListPageStore from '../../scripts/services/groceryListPageStore';

import template from './groceryIngredientListItem.html';
import './groceryIngredientListItem.scss';

class GroceryIngredientListItemCtrl {

  constructor (groceryListPageStore) {
    'ngInject';

    this.groceryListPageStore = groceryListPageStore;
    this.recipes = [];
  }

  $onInit () {
    this.recipes = this.groceryListPageStore.selectRecipesForIngredient(this.ingredient.id);
  }

  toggle () {
    this.isExpanded = !this.isExpanded;
  }

}

export default angular.module('components.groceryIngredientListItem', [groceryListPageStore])
  .component('groceryIngredientListItem', {
    template,
    bindings: {
      ingredient: '<',
      isCrossedOut: '<',
      onCrossOut: '&'
    },
    controller: GroceryIngredientListItemCtrl
  })
  .name;
