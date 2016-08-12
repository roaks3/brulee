'use strict';

angular.module('bruleeApp')
  .controller('RecipeIngredientInputCtrl', function (categoryService, Ingredient) {

    var vm = this;

    if (vm.recipeIngredient && vm.recipeIngredient.ingredient_id && !vm.recipeIngredient.ingredient) {
      Ingredient
        .find(vm.recipeIngredient.ingredient_id)
        .then((ingredient) => {
          vm.recipeIngredient.ingredient = ingredient;
        });
    }

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
