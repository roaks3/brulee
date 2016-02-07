'use strict';

// NOTE: Requires ingredients, categories, and recipes to be loaded
angular.module('bruleeApp')
  .filter('groceryListFilter', (categoryService, ingredientService, recipeService) => {

    let UNCATEGORIZED_NAME = 'Leftovers';

    return (groceryList) => {

      let selectedRecipes = oldlodash.map(groceryList.recipe_days, (recipeDay) => {
        return recipeService.get(recipeDay.recipe_id);
      });

      let recipesByIngredientId = oldlodash.reduce(selectedRecipes, (memo, recipe) => {
        oldlodash.each(recipe.recipe_ingredients, (recipe_ingredient) => {
          memo[recipe_ingredient.ingredient.id] = memo[recipe_ingredient.ingredient.id] || [];
          memo[recipe_ingredient.ingredient.id].push(recipe);
        });
        return memo;
      }, {});

      return oldlodash(recipesByIngredientId)
        .keys()
        .concat(oldlodash.map(groceryList.additional_ingredients, 'ingredient.id'))
        .map((ingredientId) => {
          return ingredientService.get(ingredientId);
        })
        .groupBy((ingredient) => {
          let category = categoryService.getByIngredientId(ingredient.id);
          return category ? category.name : UNCATEGORIZED_NAME;
        })
        .map((ingredients, categoryName) => {
          return {
            name: categoryName,
            ingredients: oldlodash.map(ingredients, (ingredient) => {
              return oldlodash.assign(ingredient, {
                recipeNames: oldlodash.map(recipesByIngredientId[ingredient.id], 'name')
              });
            })
          };
        })
        .value();

      };

  });
