
'use strict';

angular.module('bruleeApp')

  .controller('CategoryCtrl', function($scope, recipesService) {
    $scope.categories = [];
    recipesService.getCategories().then(function (categories) {
      $scope.categories = categories;
    });

    $scope.saveCategories = function() {
      recipesService.updateCategories($scope.categories);
    };

    $scope.addCategory = function(categoryName) {
      var category = new Category(null, categoryName, null, null);
      recipesService.createCategory(category).then(function (id) {
        category.id = id;
        $scope.categories.push(category);
        console.log(JSON.stringify(category));
      });
    };

    $scope.removeCategory = function(category) {
      recipesService.removeCategory(category.id).then(function () {
        var index = $scope.categories.indexOf(category);
        $scope.categories.splice(index, 1);
      });
    };

    $scope.addItem = function(item, category) {
      if (item) {
        category.items.push(item);
      }
    };

    $scope.removeItem = function(itemIndex, category) {
      category.items.splice(itemIndex, 1);
    };

  });
