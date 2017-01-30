'use strict';

angular.module('bruleeApp.services')

  .service('groceryListService', function (Ingredient, ingredientService, Recipe) {

    this.findAllRecipesById = (ids) => {
      return Recipe
        .findAll({
          q: {
            _id: {
              '$in': _.map(ids, (id) => {
                return {
                  $oid: id
                };
              })
            }
          }
        });
    };

    this.findAllIngredientsForGroceryList = (groceryList, prefetchedRecipes) => {
      const ingredientIds = _(prefetchedRecipes)
        .compact()
        .map('recipe_ingredients')
        .flatten()
        .map('ingredient_id')
        .concat(_.map(groceryList.additional_ingredients, 'ingredient_id'))
        .uniq()
        .value();

      return ingredientService.findAllIngredientsById(ingredientIds);
    };

    return this;

  });
