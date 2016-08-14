'use strict';

// NOTE: Requires ingredients, categories, and recipes to be loaded
angular.module('bruleeApp')
  .filter('groceryListFilter', (categoryService, Ingredient, Recipe) => {

    let UNCATEGORIZED_NAME = 'Uncategorized';

    return (groceryList) => {

      let selectedRecipes = _.map(groceryList.recipe_days, (recipeDay) => {
        return Recipe.get(recipeDay.recipe_id);
      });

      let recipesByIngredientId = _.reduce(selectedRecipes, (memo, recipe) => {
        _.each(recipe.recipe_ingredients, (recipeIngredient) => {
          memo[recipeIngredient.ingredient_id] = memo[recipeIngredient.ingredient_id] || [];
          memo[recipeIngredient.ingredient_id].push(recipe);
        });
        return memo;
      }, {});

      return _(recipesByIngredientId)
        .keys()
        .concat(_.map(groceryList.additional_ingredients, 'ingredient_id'))
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
