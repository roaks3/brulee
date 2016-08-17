'use strict';

angular.module('bruleeApp.services')

  .service('groceryIngredientService', function ($q, Category, categoryService,
                                                 groceryListService) {

    const UNCATEGORIZED_NAME = 'Uncategorized';

    this.generate = (groceryList) => {
      return $q
        .all([
          groceryListService.findAllIngredients(groceryList),
          Category.findAll()
        ])
        .then((data) => {
          let ingredientsByCategoryName = _.groupBy(data[0], (ingredient) => {
            let category = categoryService.getByIngredientId(ingredient.id);
            return category ? category.name : UNCATEGORIZED_NAME;
          });

          return _.map(ingredientsByCategoryName, (ingredients, categoryName) => {
            return {
              name: categoryName,
              ingredients: _.map(ingredients, (ingredient) => {
                return {
                  id: ingredient.id,
                  name: ingredient.name,
                  recipeNames: _.map(
                    groceryListService.getAllRecipesForIngredient(groceryList, ingredient.id),
                    'name'
                  )
                };
              })
            };
          });
        });
    };

    return this;

  });
