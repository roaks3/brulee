import angular from 'angular';

import selectedGroceryListStore from '../../store/selectedGroceryListStore';
import groceryIngredientList from '../groceryIngredientList/groceryIngredientList';

import template from './groceryCategoryListItem.html';
import './groceryCategoryListItem.scss';

class GroceryCategoryListItemCtrl {

  constructor (selectedGroceryListStore) {
    'ngInject';

    this.selectedGroceryListStore = selectedGroceryListStore;
  }

  $onChanges (changesObj) {
    if (changesObj.groceryList) {
      this.ingredients = this.selectedGroceryListStore
        .selectIngredientsForCategory(this.groceryList, this.category.id);
    }
  }

}

export default angular
  .module('components.groceryCategoryListItem', [
    selectedGroceryListStore,
    groceryIngredientList
  ])
  .component('groceryCategoryListItem', {
    template,
    bindings: {
      category: '<',
      crossedOutIngredients: '<',
      groceryList: '<',
      onCrossOut: '&'
    },
    controller: GroceryCategoryListItemCtrl
  })
  .name;
