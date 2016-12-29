
'use strict';

angular.module('bruleeApp')

  .controller('CategoryCtrl', function ($q, $scope, $window, categoryPageStore) {

    $scope.errors = [];
    $scope.successMessage = null;

    $scope.categories = [];
    $q.all([
      categoryPageStore.fetchAllCategories(),
      categoryPageStore.fetchAllIngredients()
    ])
      .then(() => {
        $scope.categories = categoryPageStore.categories;
      })
      .catch(error => {
        $scope.errors.push(error);
      });

    $scope.saveCategories = () => {
      $scope.errors = [];
      $scope.successMessage = null;

      categoryPageStore
        .saveAllCategories()
        .then(() => {
          $scope.successMessage = 'Saved all categories';
        })
        .catch(error => {
          $scope.errors.push(error);
        });
    };

    $scope.addCategory = categoryName => {
      if (!$window.confirm('Add a new category named \'' + categoryName + '\'?')) {
        return;
      }

      $scope.errors = [];
      $scope.successMessage = null;

      categoryPageStore
        .createCategory(categoryName)
        .then(() => {
          $scope.categories = categoryPageStore.categories;
          $scope.successMessage = 'Created category';
        })
        .catch(error => {
          $scope.errors.push(error);
        });
    };

    $scope.removeCategory = categoryId => {
      if (!$window.confirm('Remove this category?')) {
        return;
      }

      $scope.errors = [];
      $scope.successMessage = null;

      categoryPageStore
        .destroyCategory(categoryId)
        .then(() => {
          $scope.categories = categoryPageStore.categories;
          $scope.successMessage = 'Deleted category';
        })
        .catch(error => {
          $scope.errors.push(error);
        });
    };

  });
