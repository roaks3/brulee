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

  $onChanges (changesObj) {
    if (changesObj.groceryList) {
      this.recipes = this.groceryListPageStore
        .selectRecipesForIngredient(this.groceryList, this.ingredient.id);
    }
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
      groceryList: '<',
      isCrossedOut: '<',
      onCrossOut: '&'
    },
    controller: GroceryIngredientListItemCtrl
  })
  .name;
