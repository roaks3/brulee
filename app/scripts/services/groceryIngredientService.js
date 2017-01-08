'use strict';

angular.module('bruleeApp.services')

  .service('groceryIngredientService', function ($q, Category, categoryService,
                                                 groceryListService) {

    const UNCATEGORIZED_NAME = 'Uncategorized';
    const UNCATEGORIZED_ORDER = 0;

    this.generate = (groceryList) => {
      return $q
        .all([
          groceryListService.findAllIngredients(groceryList),
          Category.findAll()
        ])
        .then((data) => {
          let ingredientsByCategoryId = _.groupBy(data[0], (ingredient) => {
            let category = categoryService.getByIngredientId(ingredient.id);
            return category && category.id;
          });

          return _(ingredientsByCategoryId)
            .map((ingredients, categoryId) => {
              let category = categoryId && Category.get(categoryId);
              return {
                name: category ? category.name : UNCATEGORIZED_NAME,
                order: category ? category.order : UNCATEGORIZED_ORDER,
                ingredients
              };
            })
            .sortBy('order')
            .value();
        });
    };

    return this;

  });
