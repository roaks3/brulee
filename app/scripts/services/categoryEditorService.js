'use strict';

angular.module('bruleeApp.services')

  .service('categoryEditorService', function ($q, categoryFacade, ingredientService) {

    this.categories = function () {
      return $q.all([
        categoryFacade.categories(),
        ingredientService.refreshAll()
      ])
        .then(function (data) {
          var categories = data[0];

          return _.map(categories, function (category) {
            return _.assign(category, {
              ingredients: _.map(category.ingredient_ids, function (ingredientId) {
                return ingredientService.get(ingredientId);
              })
            });
          });
        });
    };

    this.categoryUpdateBulk = function (categories) {
      var categoryUpdates = _.map(categories, function (category) {
        return {
          id: category.id,
          ingredient_ids: _(category.ingredients).pluck('id').uniq().value()
        };
      });

      return categoryFacade.categoryUpdateBulk(categoryUpdates);
    };

    this.categoryCreate = function (categoryName, order) {
      var category = {
        name: categoryName,
        order: order
      };

      return categoryFacade.categoryCreate(category)
        .then(function (id) {
          category.id = id;
          category.ingredients = [];
          return category;
        });
    };

    this.categoryDelete = function (categoryId) {
      return categoryFacade.categoryDelete(categoryId);
    };

    return this;

  });
