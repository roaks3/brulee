import angular from 'angular';
import uiRouter from 'angular-ui-router';

import groceryListPageStore from '../../scripts/services/groceryListPageStore';
import statusBar from '../../components/statusBar/statusBar';
import groceryListSelect from '../../components/groceryListSelect/groceryListSelect';
import groceryIngredientPanel from '../../components/groceryIngredientPanel/groceryIngredientPanel';
import recipeSchedule from '../../components/recipeSchedule/recipeSchedule';

import template from './groceryListScreen.html';
import './groceryListScreen.scss';

class GroceryListScreenCtrl {

  constructor ($stateParams, groceryListPageStore) {
    'ngInject';

    this.$stateParams = $stateParams;
    this.groceryListPageStore = groceryListPageStore;
    this.errors = [];
  }

  $onInit () {
    // TODO: Default to most recent week if no id is supplied
    if (this.$stateParams.id) {
      this.selectGroceryList(this.$stateParams.id);
    }
  }

  selectGroceryList (id) {
    return this.groceryListPageStore
      .fetchGroceryList(id)
      .then(() => this.groceryListPageStore.fetchAllForGroceryList(this.groceryListPageStore.selectedGroceryList))
      .then(() => {
        this.groceryList = this.groceryListPageStore.selectedGroceryList;
      })
      .catch(error => {
        this.errors.push(error);
      });
  }

  addIngredient (ingredient) {
    this.groceryList = null;
    this.groceryListPageStore
      .addIngredientToGroceryList(ingredient)
      .then(() => {
        this.groceryList = this.groceryListPageStore.selectedGroceryList;
      });
  }

  setError (error) {
    this.errors = [error];
  }

}

export default angular
  .module('screens.groceryListScreen', [
    uiRouter,
    groceryListPageStore,
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
