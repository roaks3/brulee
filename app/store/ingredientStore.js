import angular from 'angular';

import Ingredient from '../scripts/datastores/Ingredient';

class IngredientStore {

  constructor (Ingredient) {
    'ngInject';

    this.Ingredient = Ingredient;
  }

  fetchAllIngredients () {
    return this.Ingredient
      .findAll()
      .then(ingredients => {
        this.ingredients = ingredients;
      });
  }

  fetchIngredientsById (ids) {
    return this.Ingredient
      .findAll({
        q: {
          _id: {
            $in: ids.map(id => ({$oid: id}))
          }
        }
      })
      .then(() => {
        this.ingredients = this.Ingredient.getAll();
      });
  }

  fetchIngredientsForGroceryList (groceryList, prefetchedRecipes) {
    const ingredientIds = this.selectIngredientIdsForGroceryList(groceryList, prefetchedRecipes);
    return this.fetchIngredientsById(ingredientIds);
  }

  addIngredient (ingredient) {
    this.Ingredient.inject(ingredient);
    this.ingredients = this.Ingredient.getAll();
  }

  selectIngredientsBySearchTerm (searchTerm) {
    return this.ingredients.filter(ingredient => ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }

  selectIngredientsById (ids) {
    return this.ingredients.filter(i => ids.includes(i.id));
  }

  selectIngredientIdsForGroceryList (groceryList, prefetchedRecipes) {
    return _(prefetchedRecipes)
      .compact()
      .map('recipe_ingredients')
      .flatten()
      .map('ingredient_id')
      .concat(_.map(groceryList.additional_ingredients, 'ingredient_id'))
      .uniq()
      .value();
  }

  selectIngredientsForGroceryList (groceryList, prefetchedRecipes) {
    const ingredientIds = this.selectIngredientIdsForGroceryList(groceryList, prefetchedRecipes);
    return this.selectIngredientsById(ingredientIds);
  }

}

export default angular.module('services.ingredientStore', [Ingredient])
  .service('ingredientStore', IngredientStore)
  .name;
