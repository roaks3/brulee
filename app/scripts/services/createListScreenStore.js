import moment from 'moment';
import angular from 'angular';

import categoryStore from '../../store/categoryStore';
import GroceryList from '../datastores/GroceryList';
import groceryListStore from '../../store/groceryListStore';
import ingredientStore from '../../store/ingredientStore';
import recipeStore from '../../store/recipeStore';
import selectedGroceryListStore from '../../store/selectedGroceryListStore';

class CreateListScreenStore {

  constructor (categoryStore, GroceryList, groceryListStore, ingredientStore, recipeStore, selectedGroceryListStore) {
    'ngInject';

    this.categoryStore = categoryStore;
    this.GroceryList = GroceryList;
    this.groceryListStore = groceryListStore;
    this.ingredientStore = ingredientStore;
    this.recipeStore = recipeStore;
    this.selectedGroceryListStore = selectedGroceryListStore;
  }

  init () {
    this.selectedGroceryListStore.setSelectedGroceryList({
      week_start: moment().day(0).format('YYYY-MM-DD'),
      recipe_days: []
    });
  }

  fetchAll () {
    return this.fetchRecipeUseCounts()
      // Recipes and ingredients used for searching
      .then(() => this.ingredientStore.fetchAllIngredients())
      .then(() => this.recipeStore.fetchAllRecipes())
      // Categories used for displaying grocery list, and faster/easier to have them all to start
      .then(() => this.categoryStore.fetchAllCategories());
  }

  fetchRecipeUseCounts () {
    return this.GroceryList
      .findAll()
      .then(groceryLists => {
        this.recipeUseCountsByRecipeId = groceryLists.reduce((memo, groceryList) => {
          const recipeIds = groceryList.recipe_days.map(recipeDay => recipeDay.recipe_id);
          recipeIds.forEach(recipeId => {
            memo[recipeId] = (memo[recipeId] || 0) + 1;
          });
          return memo;
        }, {});
      });
  }

  addRecipeToGroceryList (recipeId) {
    this.selectedGroceryListStore.selectedGroceryList = Object.assign(
      {},
      this.selectedGroceryListStore.selectedGroceryList,
      {
        recipe_days: [
          ...this.selectedGroceryListStore.selectedGroceryList.recipe_days,
          {
            recipe_id: recipeId,
            day_of_week: 0
          }
        ]
      }
    );
  }

  removeRecipeFromGroceryList (recipeId) {
    this.selectedGroceryListStore.selectedGroceryList = Object.assign(
      {},
      this.selectedGroceryListStore.selectedGroceryList,
      {
        recipe_days: this.selectedGroceryListStore.selectedGroceryList.recipe_days.filter(recipeDay => {
          return recipeDay.recipe_id !== recipeId;
        })
      }
    );
  }

  createGroceryList () {
    return this.groceryListStore.createGroceryList(this.selectedGroceryListStore.selectedGroceryList);
  }

  selectSortedRecipesBySearchTerm (searchTerm) {
    const ingredientIds = this.ingredientStore.selectIngredientsBySearchTerm(searchTerm).map(i => i.id);
    const recipes = this.recipeStore.selectRecipesBySearchTerm(searchTerm, ingredientIds);
    return _.sortBy(recipes, recipe => this.recipeUseCountsByRecipeId[recipe.id] || 0).reverse();
  }

}

export default angular
  .module('services.createListScreenStore', [
    categoryStore,
    GroceryList,
    groceryListStore,
    ingredientStore,
    recipeStore,
    selectedGroceryListStore
  ])
  .service('createListScreenStore', CreateListScreenStore)
  .name;
