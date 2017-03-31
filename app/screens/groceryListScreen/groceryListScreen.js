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

  constructor ($state, $stateParams, selectedGroceryListStore) {
    'ngInject';

    this.$state = $state;
    this.$stateParams = $stateParams;
    this.selectedGroceryListStore = selectedGroceryListStore;
    this.errors = [];
  }

  $onInit () {
    this.groceryListId = this.$stateParams.id;
    if (this.groceryListId) {
      this.selectedGroceryListStore
        .fetchSelectedGroceryList(this.groceryListId)
        .then(() => this.selectedGroceryListStore.fetchAllForSelectedGroceryList())
        .then(() => {
          this.groceryList = this.selectedGroceryListStore.selectedGroceryList;
        })
        .catch(error => {
          this.errors.push(error);
        });
    }
  }

  selectGroceryList (id) {
    this.$state.go('grocery', {id});
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
