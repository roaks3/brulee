import angular from 'angular';

import Recipe from '../scripts/datastores/Recipe';

class RecipeStore {

  constructor (Recipe) {
    'ngInject';

    this.Recipe = Recipe;
  }

  fetchAllRecipes () {
    return this.Recipe
      .findAll()
      .then(recipes => {
        this.recipes = recipes;
      });
  }

  fetchRecipesById (ids) {
    return this.Recipe
      .findAll({
        q: {
          _id: {
            $in: ids.map(id => ({$oid: id}))
          }
        }
      })
      .then(() => {
        this.recipes = this.Recipe.getAll();
      });
  }

  fetchRecipesForGroceryList (groceryList) {
    const recipeIds = groceryList.recipe_days.map(rd => rd.recipe_id);
    return this.fetchRecipesById(recipeIds);
  }

  addRecipe (recipe) {
    this.Recipe.inject(recipe);
    this.recipes = this.Recipe.getAll();
  }

  selectRecipesBySearchTerm (searchTerm, ingredientIds) {
    return this.recipes.filter(recipe => {
      return (recipe.name && recipe.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (recipe.tags && recipe.tags.includes(searchTerm.toLowerCase())) ||
        (recipe.recipe_ingredients && recipe.recipe_ingredients.some(ri => ingredientIds.includes(ri.ingredient_id)));
    });
  }

  selectRecipesById (ids) {
    return this.recipes.filter(r => ids.includes(r.id));
  }

  selectRecipesForGroceryList (groceryList) {
    const recipeIds = groceryList.recipe_days.map(rd => rd.recipe_id);
    return this.selectRecipesById(recipeIds);
  }

}

export default angular.module('services.recipeStore', [Recipe])
  .service('recipeStore', RecipeStore)
  .name;
