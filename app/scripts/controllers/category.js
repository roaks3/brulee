
'use strict';

angular.module('bruleeApp')

  .controller('CategoryCtrl', function ($q, $scope, categoryService, ingredientService) {

    $scope.categories = [];
    $q.all([
      categoryService.categories(),
      ingredientService.ingredients()
    ])
      .then(function (data) {
        var categories = data[0];
        var ingredients = data[1];

        var ingredientsById = _.indexBy(ingredients, 'id');

        $scope.categories = _.map(categories, function (category) {
          return {
            name: category.name,
            order: category.order,
            items: _.map(category.ingredient_ids, function (ingredientId) {
              return ingredientsById[ingredientId].name;
            }),
            ingredients: _.map(category.ingredient_ids, function (ingredientId) {
              return ingredientsById[ingredientId];
            })
          };
        });
      });

    $scope.saveCategories = function() {
      categoryService.categoryUpdateBulk($scope.categories);
    };

    $scope.addCategory = function (categoryName) {
      var category = new Category(null, categoryName, null, null);
      categoryService.categoryCreate(category)
        .then(function (id) {
          category.id = id;
          $scope.categories.push(category);
        });
    };

    $scope.removeCategory = function (category) {
      categoryService.categoryDelete(category.id)
        .then(function () {
          var index = $scope.categories.indexOf(category);
          $scope.categories.splice(index, 1);
        });
    };

    $scope.addItem = function (item, category) {
      if (item) {
        category.items.push(item);
      }
    };

    $scope.removeItem = function (itemIndex, category) {
      category.items.splice(itemIndex, 1);
    };

  });
