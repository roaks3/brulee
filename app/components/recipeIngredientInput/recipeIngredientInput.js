'use strict';

class RecipeIngredientInputCtrl {

  constructor (categoryService, Ingredient) {
    this.categoryService = categoryService;
    this.Ingredient = Ingredient;
  }

  $onInit () {
    this.Ingredient
      .find(this.recipeIngredient.ingredient_id)
      .then((ingredient) => {
        this.ingredient = ingredient;
        this.category = this.categoryService.getByIngredientId(ingredient.id);
      });
  }

  changeIngredient (ingredient) {
    this.ingredient = ingredient;
    this.category = this.categoryService.getByIngredientId(ingredient.id);
    this.onIngredientChange({ingredientId: this.ingredient.id});
  }

}

angular.module('bruleeApp')
  .component('recipeIngredientInput', {
    bindings: {
      recipeIngredient: '<',
      onRemove: '&',
      onIngredientChange: '&',
      inputDisabled: '<'
    },
    controller: RecipeIngredientInputCtrl,
    controllerAs: 'vm',
    templateUrl: 'components/recipeIngredientInput/recipeIngredientInput.html'
  });
