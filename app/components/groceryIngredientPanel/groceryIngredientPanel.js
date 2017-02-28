import angular from 'angular';

import selectedGroceryListStore from '../../store/selectedGroceryListStore';
import addIngredientForm from '../addIngredientForm/addIngredientForm';
import groceryCategoryList from '../groceryCategoryList/groceryCategoryList';

import template from './groceryIngredientPanel.html';
import './groceryIngredientPanel.scss';

class GroceryIngredientPanelCtrl {

  constructor (selectedGroceryListStore) {
    'ngInject';

    this.selectedGroceryListStore = selectedGroceryListStore;
  }

  $onInit () {
    this.selectedGroceryListStore.fetchCrossedOutIngredients();
    this.crossedOutIngredients = this.selectedGroceryListStore.crossedOutIngredientIds;
  }

  $onChanges (changesObj) {
    if (changesObj.groceryList) {
      this.categories = this.selectedGroceryListStore
        .selectCategoriesForGroceryList(this.groceryList);
    }
  }

  openAddIngredient () {
    this.showAddIngredient = true;
  }

  crossOut (ingredient) {
    this.selectedGroceryListStore.toggleCrossedOutIngredient(ingredient.id);
    this.crossedOutIngredients = this.selectedGroceryListStore.crossedOutIngredientIds;
  }

  clearCrossedOutIngredients () {
    this.selectedGroceryListStore.clearCrossedOutIngredients();
    this.crossedOutIngredients = this.selectedGroceryListStore.crossedOutIngredientIds;
  }

}

export default angular
  .module('components.groceryIngredientPanel', [
    selectedGroceryListStore,
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
