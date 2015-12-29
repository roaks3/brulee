
'use strict';

angular.module('bruleeApp')

  .controller('CategoryCtrl', function ($scope, categoryService) {

    $scope.errors = [];
    $scope.successMessage = null;

    $scope.categories = [];
    categoryService.findAll()
      .then(function (data) {
        $scope.categories = data;
      })
      .catch(function (error) {
        $scope.errors.push(error);
      });

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
      if (!confirm('Add a new category named \'' + categoryName + '\'?')) {
        return;
      }

      $scope.errors = [];
      $scope.successMessage = null;

      categoryService.create({
        name: categoryName,
        order: categoryService.size() + 1
      })
        .then(function (data) {
          $scope.successMessage = 'Created category';
        })
        .catch(function (error) {
          $scope.errors.push(error);
        });
    };

    $scope.removeCategory = function (categoryId) {
      if (!confirm('Remove this category?')) {
        return;
      }

      $scope.errors = [];
      $scope.successMessage = null;

      categoryService.destroy(categoryId)
        .then(function () {
          $scope.successMessage = 'Deleted category';
        })
        .catch(function (error) {
          $scope.errors.push(error);
        });
    };

    $scope.addIngredient = function (category, ingredient) {
      if (!confirm('Add \'' + ingredient.name + '\' to \'' + category.name + '\'?')) {
        return;
      }

      if (ingredient && ingredient.id) {
        if (!_.find(category.ingredients, 'id', ingredient.id)) {
          // Remove ingredient from all other categories
          _.each($scope.categories, function (otherCategory) {
            _.remove(otherCategory.ingredients, 'id', ingredient.id);
          });

          // Add ingredient to this category
          category.ingredients.push(ingredient);

          //TODO: Figure out how to actually clear the typeahead
          $scope.newIngredient = null;
        } else {
          alert('This ingredient already exists in this category');
        }
      } else {
        alert('This ingredient is invalid and cannot be added');
      }
    };

    $scope.removeIngredient = function (category, ingredientId) {
      _.remove(category.ingredients, 'id', ingredientId);
    };

  });
