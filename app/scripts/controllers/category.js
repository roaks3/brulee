
'use strict';

angular.module('bruleeApp')

  .controller('CategoryCtrl', function ($q, $scope, categoryService, ingredientService) {

    $scope.ingredients = [];
    $scope.categories = [];
    $q.all([
      categoryService.categories(),
      ingredientService.ingredients()
    ])
      .then(function (data) {
        var categories = data[0];
        $scope.ingredients = data[1];

        var ingredientsById = _.indexBy($scope.ingredients, 'id');

        $scope.categories = _.map(categories, function (category) {
          return {
            id: category.id,
            name: category.name,
            order: category.order,
            ingredients: _.map(category.ingredient_ids, function (ingredientId) {
              return ingredientsById[ingredientId];
            })
          };
        });
      });

    $scope.saveCategories = function() {
      categoryService.categoryUpdateBulk(
        _.map($scope.categories, function (category) {
          return {
            id: category.id,
            ingredient_ids: _.pluck(category.ingredients, 'id')
          };
        })
      );
    };

    $scope.addCategory = function (categoryName) {
      if (!confirm('Add a new category named \'' + categoryName + '\'?')) {
        return;
      }

      var category = {
        name: categoryName,
        order: $scope.categories.length + 1
      };

      categoryService.categoryCreate(category)
        .then(function (id) {
          category.id = id;
          category.ingredients = [];
          $scope.categories.push(category);
        });
    };

    $scope.removeCategory = function (categoryId) {
      if (!confirm('Remove this category?')) {
        return;
      }

      categoryService.categoryDelete(categoryId)
        .then(function () {
          _.remove($scope.categories, 'id', categoryId);
        });
    };

    $scope.addIngredient = function (category, ingredient) {
      if (ingredient && ingredient.id) {
        if (!_.find(category.ingredients, 'id', ingredient.id)) {
          // Remove ingredient from all other categories
          _.each($scope.categories, function (otherCategory) {
              _.remove(otherCategory.ingredients, 'id', ingredient.id);
            }
          );

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
