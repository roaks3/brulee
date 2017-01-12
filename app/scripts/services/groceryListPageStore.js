'use strict';

class GroceryListPageStore {

  constructor (GroceryList, groceryListService) {
    this.GroceryList = GroceryList;
    this.groceryListService = groceryListService;
  }

  fetchGroceryList (id) {
    return this.GroceryList
      .find(id)
      .then(groceryList => {
        this.groceryList = groceryList;
      });
  }

  fetchAllRecipesForGroceryList () {
    return this.groceryListService
      .findAllRecipesById(_.map(this.groceryList.recipe_days, 'recipe_id'))
      .then(recipes => {
        this.recipes = recipes;
      });
  }

  selectRecipesForIngredient (ingredientId) {
    return _.filter(this.recipes, recipe => {
      return _.includes(_.map(recipe.recipe_ingredients, 'ingredient_id'), ingredientId);
    });
  }

  selectRecipesForDayOfWeek (dayOfWeek) {
    const recipeIds = this.groceryList.recipe_days
      .filter(recipeDay => recipeDay.day_of_week === dayOfWeek)
      .map(recipeDay => recipeDay.recipe_id);

    return this.recipes.filter(recipe => recipeIds.includes(recipe.id));
  }

}

angular.module('bruleeApp.services')
  .service('groceryListPageStore', GroceryListPageStore);
