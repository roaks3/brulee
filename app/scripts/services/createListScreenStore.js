'use strict';

class CreateListScreenStore {

  constructor (GroceryList, ingredientStore, recipeStore) {
    this.GroceryList = GroceryList;
    this.ingredientStore = ingredientStore;
    this.recipeStore = recipeStore;
  }

  fetchAll () {
    return this.fetchRecipeUseCounts()
      .then(() => this.ingredientStore.fetchAllIngredients())
      .then(() => this.recipeStore.fetchAllRecipes())
      .then(() => {
        this.recipes = this.recipeStore.allRecipes;
      });
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

  selectSortedRecipesBySearchTerm (searchTerm) {
    const ingredientIds = this.ingredientStore.selectIngredientsBySearchTerm(searchTerm).map(i => i.id);
    const recipes = this.recipeStore.selectRecipesBySearchTerm(searchTerm, ingredientIds);
    return _.sortBy(recipes, recipe => this.recipeUseCountsByRecipeId[recipe.id] || 0).reverse();
  }

}

angular.module('bruleeApp.services')
  .service('createListScreenStore', CreateListScreenStore);
