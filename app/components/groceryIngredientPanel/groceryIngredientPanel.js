import angular from 'angular';

import crossedOutIngredientsStore from '../../store/crossedOutIngredientsStore';
import selectedGroceryListStore from '../../store/selectedGroceryListStore';
import addIngredientForm from '../addIngredientForm/addIngredientForm';
import groceryCategoryList from '../groceryCategoryList/groceryCategoryList';

import template from './groceryIngredientPanel.html';
import './groceryIngredientPanel.scss';

class GroceryIngredientPanelCtrl {

  constructor (crossedOutIngredientsStore, selectedGroceryListStore) {
    'ngInject';

    this.crossedOutIngredientsStore = crossedOutIngredientsStore;
    this.selectedGroceryListStore = selectedGroceryListStore;
  }

  $onInit () {
    this.crossedOutIngredientsStore.fetchCrossedOutIngredients();
    this.crossedOutIngredients = this.crossedOutIngredientsStore.selectAllCrossedOutIngredientIds();
  }

  $onChanges (changesObj) {
    if (changesObj.groceryList) {
      this.categories = this.selectedGroceryListStore.selectCategories();
    }
  }

  openAddIngredient () {
    this.showAddIngredient = true;
  }

  crossOut (ingredient) {
    this.crossedOutIngredientsStore.toggleCrossedOutIngredient(ingredient.id);
    this.crossedOutIngredients = this.crossedOutIngredientsStore.selectAllCrossedOutIngredientIds();
  }

  clearCrossedOutIngredients () {
    this.crossedOutIngredientsStore.clearCrossedOutIngredients();
    this.crossedOutIngredients = this.crossedOutIngredientsStore.selectAllCrossedOutIngredientIds();
  }

}

export default angular
  .module('components.groceryIngredientPanel', [
    crossedOutIngredientsStore,
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
