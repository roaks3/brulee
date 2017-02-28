import angular from 'angular';

import groceryListPageStore from '../../scripts/services/groceryListPageStore';
import addIngredientForm from '../addIngredientForm/addIngredientForm';
import groceryCategoryList from '../groceryCategoryList/groceryCategoryList';

import template from './groceryIngredientPanel.html';
import './groceryIngredientPanel.scss';

class GroceryIngredientPanelCtrl {

  constructor (groceryListPageStore) {
    'ngInject';

    this.groceryListPageStore = groceryListPageStore;
  }

  $onInit () {
    this.groceryListPageStore.fetchCrossedOutIngredients();
    this.crossedOutIngredients = this.groceryListPageStore.crossedOutIngredientIds;
  }

  $onChanges (changesObj) {
    if (changesObj.groceryList) {
      this.categories = this.groceryListPageStore
        .selectCategoriesForGroceryList(this.groceryList);
    }
  }

  openAddIngredient () {
    this.showAddIngredient = true;
  }

  crossOut (ingredient) {
    this.groceryListPageStore.toggleCrossedOutIngredient(ingredient.id);
    this.crossedOutIngredients = this.groceryListPageStore.crossedOutIngredientIds;
  }

  clearCrossedOutIngredients () {
    this.groceryListPageStore.clearCrossedOutIngredients();
    this.crossedOutIngredients = this.groceryListPageStore.crossedOutIngredientIds;
  }

}

export default angular
  .module('components.groceryIngredientPanel', [
    groceryListPageStore,
    addIngredientForm,
    groceryCategoryList
  ])
  .component('groceryIngredientPanel', {
    template,
    bindings: {
      groceryList: '<',
      onAddIngredient: '&',
      onError: '&'
    },
    controller: GroceryIngredientPanelCtrl
  })
  .name;
