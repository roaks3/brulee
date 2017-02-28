import angular from 'angular';

import selectedGroceryListStore from '../../store/selectedGroceryListStore';

import template from './groceryIngredientListItem.html';
import './groceryIngredientListItem.scss';

class GroceryIngredientListItemCtrl {

  constructor (selectedGroceryListStore) {
    'ngInject';

    this.selectedGroceryListStore = selectedGroceryListStore;
    this.recipes = [];
  }

  $onChanges (changesObj) {
    if (changesObj.groceryList) {
      this.recipes = this.selectedGroceryListStore
        .selectRecipesForIngredient(this.groceryList, this.ingredient.id);
    }
  }

  toggle () {
    this.isExpanded = !this.isExpanded;
  }

}

export default angular.module('components.groceryIngredientListItem', [selectedGroceryListStore])
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
