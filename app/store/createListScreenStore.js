import moment from 'moment';
import angular from 'angular';

import categoryStore from './categoryStore';
import groceryListStore from './groceryListStore';
import ingredientStore from './ingredientStore';
import recipeStore from './recipeStore';
import selectedGroceryListStore from './selectedGroceryListStore';

class CreateListScreenStore {

  constructor (categoryStore, groceryListStore, ingredientStore, recipeStore, selectedGroceryListStore) {
    'ngInject';

    this.categoryStore = categoryStore;
    this.groceryListStore = groceryListStore;
    this.ingredientStore = ingredientStore;
    this.recipeStore = recipeStore;
    this.selectedGroceryListStore = selectedGroceryListStore;
  }

  init () {
    this.selectedGroceryListStore.setSelectedGroceryList({
      week_start: moment().format('YYYY-MM-DD'),
      recipe_days: []
    });
  }

  fetchAll () {
    // Recipes and ingredients used for searching
    return this.ingredientStore.fetchAllIngredients()
      .then(() => this.recipeStore.fetchAllRecipes({ includeUseCounts: true }))
      // Categories used for displaying grocery list, and faster/easier to have them all to start
      .then(() => this.categoryStore.fetchAllCategories());
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
    return _.sortBy(recipes, recipe => recipe.use_count || 0).reverse();
  }

}

export default angular
  .module('services.createListScreenStore', [
    categoryStore,
    groceryListStore,
    ingredientStore,
    recipeStore,
    selectedGroceryListStore
  ])
  .service('createListScreenStore', CreateListScreenStore)
  .name;
