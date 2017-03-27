import angular from 'angular';
import uiRouter from 'angular-ui-router';

import selectedGroceryListStore from '../../store/selectedGroceryListStore';
import statusBar from '../../components/statusBar/statusBar';
import groceryListSelect from '../../components/groceryListSelect/groceryListSelect';
import groceryIngredientPanel from '../../components/groceryIngredientPanel/groceryIngredientPanel';
import recipeSchedule from '../../components/recipeSchedule/recipeSchedule';

import template from './groceryListScreen.html';
import './groceryListScreen.scss';

class GroceryListScreenCtrl {

  constructor ($stateParams, selectedGroceryListStore) {
    'ngInject';

    this.$stateParams = $stateParams;
    this.selectedGroceryListStore = selectedGroceryListStore;
    this.errors = [];
  }

  $onInit () {
    // TODO: Default to most recent week if no id is supplied
    if (this.$stateParams.id) {
      this.selectGroceryList(this.$stateParams.id);
    }
  }

  selectGroceryList (id) {
    return this.selectedGroceryListStore
      .fetchSelectedGroceryList(id)
      .then(() => this.selectedGroceryListStore.fetchAllForSelectedGroceryList())
      .then(() => {
        this.groceryList = this.selectedGroceryListStore.selectedGroceryList;
      })
      .catch(error => {
        this.errors.push(error);
      });
  }

  addIngredient (ingredient) {
    this.groceryList = null;
    this.selectedGroceryListStore
      .addIngredientToGroceryList(ingredient)
      .then(() => {
        this.groceryList = this.selectedGroceryListStore.selectedGroceryList;
      });
  }

  setError (error) {
    this.errors = [error];
  }

}

export default angular
  .module('screens.groceryListScreen', [
    uiRouter,
    selectedGroceryListStore,
    statusBar,
    groceryListSelect,
    groceryIngredientPanel,
    recipeSchedule
  ])
  .component('groceryListScreen', {
    template,
    controller: GroceryListScreenCtrl,
    controllerAs: 'vm'
  })
  .name;
