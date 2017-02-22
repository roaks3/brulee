import angular from 'angular';

import groceryListPageStore from '../../scripts/services/groceryListPageStore';
import groceryIngredientList from '../groceryIngredientList/groceryIngredientList';

import template from './groceryCategoryListItem.html';
import './groceryCategoryListItem.scss';

class GroceryCategoryListItemCtrl {

  constructor (groceryListPageStore) {
    'ngInject';

    this.groceryListPageStore = groceryListPageStore;
  }

  $onInit () {
    this.ingredients = this.groceryListPageStore.selectIngredientsForCategory(this.category.id);
  }

}

export default angular
  .module('components.groceryCategoryListItem', [
    groceryListPageStore,
    groceryIngredientList
  ])
  .component('groceryCategoryListItem', {
    template,
    bindings: {
      category: '<',
      crossedOutIngredients: '<',
      onCrossOut: '&'
    },
    controller: GroceryCategoryListItemCtrl
  })
  .name;
