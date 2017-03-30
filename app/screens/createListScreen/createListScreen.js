import angular from 'angular';

import createListScreenStore from '../../scripts/services/createListScreenStore';
import selectedGroceryListStore from '../../store/selectedGroceryListStore';
import statusBar from '../../components/statusBar/statusBar';
import recipeListItem from '../../components/recipeListItem/recipeListItem';
import recipeDayInput from '../../components/recipeDayInput/recipeDayInput';
import groceryCategoryList from '../../components/groceryCategoryList/groceryCategoryList';

import template from './createListScreen.html';
import './createListScreen.scss';

class CreateListScreenCtrl {

  constructor ($window, createListScreenStore, selectedGroceryListStore) {
    'ngInject';

    this.$window = $window;
    this.createListScreenStore = createListScreenStore;
    this.selectedGroceryListStore = selectedGroceryListStore;
  }

  $onInit () {
    this.errors = [];
    this.recipeSearch = { str: this.$window.sessionStorage.getItem('recipeFilterQuery') || '' };

    this.createListScreenStore
      .fetchAll()
      .then(() => {
        this.createListScreenStore.init();
        this.newGroceryList = this.selectedGroceryListStore.selectedGroceryList;
        this.categories = [];
        this.recipeUseCountsByRecipeId = this.createListScreenStore.recipeUseCountsByRecipeId;
        this.filterRecipes();
      })
      .catch(error => {
        this.errors.push(error);
      });
  }

  filterRecipes () {
    this.$window.sessionStorage.setItem('recipeFilterQuery', this.recipeSearch.str);
    this.filteredRecipes = this.createListScreenStore.selectSortedRecipesBySearchTerm(this.recipeSearch.str);
  }

  saveGroceryList () {
    this.errors = [];
    this.successMessage = null;

    if (this.newGroceryList.id) {
      //GroceryList.update($scope.newGroceryList);
      this.errors.push('Cannot update the grocery list in this view');
    } else {
      this.createListScreenStore
        .createGroceryList()
        .then(() => {
          this.successMessage = 'Grocery list saved';
        })
        .catch(error => {
          this.errors.push(error);
        });
    }
  }

  updateDayOfWeek (recipeDay, day) {
    recipeDay.day_of_week = day;
  }

  addRecipe (recipe) {
    this.createListScreenStore.addRecipeToGroceryList(recipe.id);
    this.newGroceryList = this.selectedGroceryListStore.selectedGroceryList;
    this.categories = this.selectedGroceryListStore.selectCategories();
  }

  removeRecipe (recipe) {
    this.createListScreenStore.removeRecipeFromGroceryList(recipe.id);
    this.newGroceryList = this.selectedGroceryListStore.selectedGroceryList;
    this.categories = this.selectedGroceryListStore.selectCategories();
  }

}

export default angular
  .module('screens.createListScreen', [
    createListScreenStore,
    selectedGroceryListStore,
    statusBar,
    recipeListItem,
    recipeDayInput,
    groceryCategoryList
  ])
  .component('createListScreen', {
    template,
    controller: CreateListScreenCtrl
  })
  .name;
