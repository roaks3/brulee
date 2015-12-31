'use strict';

angular.module('bruleeApp')
  .controller('RecipeIngredientInputCtrl', function (categoryService) {

    var vm = this;

    vm.isNewIngredient = function () {
      return !(vm.recipeIngredient &&
        vm.recipeIngredient.ingredient &&
        vm.recipeIngredient.ingredient.id);
    };

    vm.onIngredientChange = function (ingredient) {
      vm.recipeIngredient.selectedCategory =
        categoryService.getByIngredientId(ingredient.id);
    };

  });

angular.module('bruleeApp')
  .directive('recipeIngredientInput', function () {
    return {
      scope: {},
      bindToController: {
        recipeIngredient: '=',
        onRemove: '&'
      },
      controller: 'RecipeIngredientInputCtrl',
      controllerAs: 'vm',
      templateUrl: 'views/recipeIngredientInput.html'
    };
  });
