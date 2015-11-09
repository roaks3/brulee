
'use strict';

angular.module('bruleeApp')

  .controller('CategoryCtrl', function ($scope, categoryService) {
    
    $scope.categories = [];
    categoryService.categories()
      .then(function (categories) {
        $scope.categories = categories;
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
