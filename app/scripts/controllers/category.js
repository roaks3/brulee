
'use strict';

angular.module('bruleeApp')

  .controller('CategoryCtrl', function ($scope, $window, Category, categoryService, Ingredient) {

    $scope.errors = [];
    $scope.successMessage = null;

    $scope.categories = [];
    Category.refreshAll()
      .then(function (data) {
        $scope.categories = data;
      })
      .catch(function (error) {
        $scope.errors.push(error);
      });

    Ingredient.refreshAll();

    $scope.getIngredient = (id) => {
      return Ingredient.get(id) || {};
    };

    $scope.saveCategories = function () {
      $scope.errors = [];
      $scope.successMessage = null;

      categoryService.updateAll($scope.categories)
        .then(function () {
          $scope.successMessage = 'Saved all categories';
        })
        .catch(function (error) {
          $scope.errors.push(error);
        });
    };

    $scope.addCategory = function (categoryName) {
      if (!$window.confirm('Add a new category named \'' + categoryName + '\'?')) {
        return;
      }

      $scope.errors = [];
      $scope.successMessage = null;

      Category
        .create({
          name: categoryName,
          order: categoryService.size() + 1,
          ingredient_ids: []
        })
        .then(function () {
          $scope.successMessage = 'Created category';
        })
        .catch(function (error) {
          $scope.errors.push(error);
        });
    };

    $scope.removeCategory = function (categoryId) {
      if (!$window.confirm('Remove this category?')) {
        return;
      }

      $scope.errors = [];
      $scope.successMessage = null;

      Category.destroy(categoryId)
        .then(function () {
          $scope.successMessage = 'Deleted category';
        })
        .catch(function (error) {
          $scope.errors.push(error);
        });
    };

    $scope.addIngredient = function (category, ingredient) {
      if (!$window.confirm('Add \'' + ingredient.name + '\' to \'' + category.name + '\'?')) {
        return;
      }

      if (!_.find(category.ingredient_ids, ingredient.id)) {
        // Remove ingredient from all other categories
        _.each($scope.categories, function (otherCategory) {
          _.pull(otherCategory.ingredient_ids, ingredient.id);
        });

        // Add ingredient to this category
        category.ingredient_ids.push(ingredient.id);
      } else {
        $window.alert('This ingredient already exists in this category');
      }
    };

    $scope.removeIngredient = function (category, ingredientId) {
      _.pull(category.ingredient_ids, ingredientId);
    };

  });
