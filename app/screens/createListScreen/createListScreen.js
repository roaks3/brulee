import moment from 'moment';
import angular from 'angular';

import GroceryList from '../../scripts/datastores/GroceryList';
import createListScreenStore from '../../scripts/services/createListScreenStore';
import groceryListPageStore from '../../scripts/services/groceryListPageStore';
import statusBar from '../../components/statusBar/statusBar';
import recipeDayInput from '../../components/recipeDayInput/recipeDayInput';
import groceryCategoryList from '../../components/groceryCategoryList/groceryCategoryList';

import template from './createListScreen.html';
import './createListScreen.scss';

class CreateListScreenCtrl {

  constructor ($window, createListScreenStore, GroceryList, groceryListPageStore) {
    'ngInject';

    this.$window = $window;
    this.createListScreenStore = createListScreenStore;
    this.GroceryList = GroceryList;
    this.groceryListPageStore = groceryListPageStore;
  }

  $onInit () {
    this.recipes = [];
    this.errors = [];
    this.recipeSearch = { str: this.$window.sessionStorage.getItem('recipeFilterQuery') || '' };

    this.createListScreenStore
      .fetchAll()
      .then(() => this.groceryListPageStore.fetchAllCategories())
      .then(() => {
        this.recipeUseCountsByRecipeId = this.createListScreenStore.recipeUseCountsByRecipeId;
        this.recipes = this.createListScreenStore.recipes;
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

  calculateShoppingList () {
    const selectedRecipes = _(this.recipes)
      .filter('_selected')
      .value();

    this.newGroceryList = {
      week_start: moment().day(0).format('YYYY-MM-DD'),
      recipe_days: _.map(selectedRecipes, recipe => ({
        recipe_id: recipe.id,
        day_of_week: 0
      }))
    };

    this.groceryListPageStore.setSelectedGroceryList(this.newGroceryList);
    this.groceryListPageStore
      .fetchAllRecipesForGroceryList()
      .then(() => this.groceryListPageStore.fetchAllIngredientsForGroceryList())
      .then(() => {
        this.categories = this.groceryListPageStore.selectCategoriesForIngredients();
      });
  }

  saveGroceryList () {
    this.errors = [];
    this.successMessage = null;

    if (this.newGroceryList.id) {
      //GroceryList.update($scope.newGroceryList);
      this.errors.push('Cannot update the grocery list in this view');
    } else {
      this.GroceryList
        .create({
          week_start: this.newGroceryList.week_start,
          recipe_days: _.map(this.newGroceryList.recipe_days, recipeDay => {
            return _.pick(recipeDay, ['recipe_id', 'day_of_week']);
          })
        })
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

}

export default angular
  .module('screens.createListScreen', [
    GroceryList,
    createListScreenStore,
    groceryListPageStore,
    statusBar,
    recipeDayInput,
    groceryCategoryList
  ])
  .component('createListScreen', {
    template,
    controller: CreateListScreenCtrl
  })
  .name;
