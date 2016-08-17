'use strict';

angular.module('bruleeApp.services')

  .service('groceryListService', function (Ingredient, Recipe) {

    this.findAllRecipes = (groceryList) => {
      return Recipe
        .findAll({
          q: {_id: {'$in': _.map(groceryList.recipe_days, 'recipe_id')}}
        });
    };

    this.getAllRecipesForIngredient = (groceryList, ingredientId) => {
      let recipes = Recipe.filter({
        where: {
          id: {
            'in': _.map(groceryList.recipe_days, 'recipe_id')
          }
        }
      });

      return _.filter(recipes, (recipe) => {
        return _.includes(_.map(recipe.recipe_ingredients, 'ingredient_id'), ingredientId);
      });
    };

    this.findAllIngredients = (groceryList) => {
      let ingredientIds = [];
      return this
        .findAllRecipes(groceryList)
        .then((data) => {
          ingredientIds = _.concat(
            _(data)
              .map('recipe_ingredients')
              .flatten()
              .map('ingredient_id')
              .uniq()
              .value(),
            _.map(groceryList.additional_ingredients, 'ingredient_id')
          );
        })
        .then(() => Ingredient.findAll({q: {_id: {'$in': ingredientIds}}}));
    };

    return this;

  });
