'use strict';

class GroceryListPageStore {

  constructor ($window, GroceryList, groceryListService) {
    this.$window = $window;
    this.GroceryList = GroceryList;
    this.groceryListService = groceryListService;
  }

  fetchGroceryList (id) {
    return this.GroceryList
      .find(id)
      .then(groceryList => {
        this.selectedGroceryList = groceryList;
      });
  }

  fetchAllRecipesForGroceryList () {
    return this.groceryListService
      .findAllRecipesById(_.map(this.selectedGroceryList.recipe_days, 'recipe_id'))
      .then(recipes => {
        this.selectedRecipes = recipes;
      });
  }

  setSelectedGroceryList (groceryList) {
    this.selectedGroceryList = groceryList;
  }

  fetchCrossedOutIngredients () {
    this.crossedOutIngredientIds = JSON.parse(this.$window.localStorage.getItem('crossedOutIngredientIds')) || [];
  }

  toggleCrossedOutIngredient (ingredientId) {
    if (this.crossedOutIngredientIds.includes(ingredientId)) {
      this.crossedOutIngredientIds =
        this.crossedOutIngredientIds.filter(crossedOutIngredientId => crossedOutIngredientId !== ingredientId);
    } else {
      this.crossedOutIngredientIds = [...this.crossedOutIngredientIds, ingredientId];
    }
    this.$window.localStorage.setItem('crossedOutIngredientIds', JSON.stringify(this.crossedOutIngredientIds));
  }

  clearCrossedOutIngredients () {
    this.crossedOutIngredientIds = [];
    this.$window.localStorage.setItem('crossedOutIngredientIds', JSON.stringify(this.crossedOutIngredientIds));
  }

  selectRecipesForIngredient (ingredientId) {
    return this.selectedRecipes.filter(recipe => {
      return _.map(recipe.recipe_ingredients, 'ingredient_id').includes(ingredientId);
    });
  }

  selectRecipesForDayOfWeek (dayOfWeek) {
    const recipeIds = this.selectedGroceryList.recipe_days
      .filter(recipeDay => recipeDay.day_of_week === dayOfWeek)
      .map(recipeDay => recipeDay.recipe_id);

    return this.selectedRecipes.filter(recipe => recipeIds.includes(recipe.id));
  }

}

angular.module('bruleeApp.services')
  .service('groceryListPageStore', GroceryListPageStore);
