'use strict';

class RecipeIngredientInputCtrl {

  constructor (categoryService, Ingredient) {
    this.categoryService = categoryService;
    this.Ingredient = Ingredient;
  }

  $onInit () {
    if (this.recipeIngredient && this.recipeIngredient.ingredient_id && !this.recipeIngredient.ingredient) {
      this.Ingredient
        .find(this.recipeIngredient.ingredient_id)
        .then((ingredient) => {
          this.recipeIngredient.ingredient = ingredient;
        });
    }
  }

  isNewIngredient () {
    return !(this.recipeIngredient &&
      this.recipeIngredient.ingredient &&
      this.recipeIngredient.ingredient.id);
  };

  onIngredientChange (ingredient) {
    this.recipeIngredient.ingredient = ingredient;
    this.recipeIngredient.selectedCategory =
      this.categoryService.getByIngredientId(ingredient.id);
  };

  updateCategory (category) {
    this.recipeIngredient.selectedCategory = category;
  };

}

angular.module('bruleeApp')
  .component('recipeIngredientInput', {
    bindings: {
      recipeIngredient: '=',
      onRemove: '&'
    },
    controller: RecipeIngredientInputCtrl,
    controllerAs: 'vm',
    templateUrl: 'views/recipeIngredientInput.html'
  });
