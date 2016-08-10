'use strict';

// NOTE: Requires ingredients, categories, and recipes to be loaded
angular.module('bruleeApp')
  .filter('groceryListFilter', (categoryService, Ingredient, recipeService) => {

    let UNCATEGORIZED_NAME = 'Leftovers';

    return (groceryList) => {

      let selectedRecipes = _.map(groceryList.recipe_days, (recipeDay) => {
        return recipeService.get(recipeDay.recipe_id);
      });

      let recipesByIngredientId = _.reduce(selectedRecipes, (memo, recipe) => {
        _.each(recipe.recipe_ingredients, (recipe_ingredient) => {
          memo[recipe_ingredient.ingredient.id] = memo[recipe_ingredient.ingredient.id] || [];
          memo[recipe_ingredient.ingredient.id].push(recipe);
        });
        return memo;
      }, {});

      return _(recipesByIngredientId)
        .keys()
        .concat(_.map(groceryList.additional_ingredients, 'ingredient.id'))
        .map((ingredientId) => {
          return Ingredient.get(ingredientId);
        })
        .groupBy((ingredient) => {
          let category = categoryService.getByIngredientId(ingredient.id);
          return category ? category.name : UNCATEGORIZED_NAME;
        })
        .map((ingredients, categoryName) => {
          return {
            name: categoryName,
            ingredients: _.map(ingredients, (ingredient) => {
              return _.assign(ingredient, {
                recipeNames: _.map(recipesByIngredientId[ingredient.id], 'name')
              });
            })
          };
        })
        .value();

      };

  });
