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
      vm.recipeIngredient.ingredient = ingredient;
      vm.recipeIngredient.selectedCategory =
        categoryService.getByIngredientId(ingredient.id);
    };

    vm.updateCategory = (category) => {
      vm.recipeIngredient.selectedCategory = category;
    };

  });

angular.module('bruleeApp')
  .component('recipeIngredientInput', {
    bindings: {
      recipeIngredient: '=',
      onRemove: '&'
    },
    controller: 'RecipeIngredientInputCtrl as vm',
    templateUrl: 'views/recipeIngredientInput.html'
  });
