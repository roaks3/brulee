'use strict';

class GroceryListPageStore {

  constructor (groceryListService) {
    this.groceryListService = groceryListService;
  }

  fetchAllRecipesForGroceryList (groceryList) {
    return this.groceryListService
      .findAllRecipesById(_.map(groceryList.recipe_days, 'recipe_id'))
      .then(recipes => {
        this.recipes = recipes;
      });
  }

  selectRecipesForIngredient (ingredientId) {
    return _.filter(this.recipes, recipe => {
      return _.includes(_.map(recipe.recipe_ingredients, 'ingredient_id'), ingredientId);
    });
  }

}

angular.module('bruleeApp.services')
  .service('groceryListPageStore', GroceryListPageStore);
