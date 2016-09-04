'use strict';

class NewRecipeIngredientInputCtrl {

  constructor (categoryService) {
    this.categoryService = categoryService;
  }

  isNewIngredient () {
    return !this.ingredient.id;
  }

  changeIngredient (ingredient) {
    this.onIngredientChange({ingredient: ingredient});
    this.onCategoryChange({category: this.categoryService.getByIngredientId(ingredient.id)});
  }

}

angular.module('bruleeApp')
  .component('newRecipeIngredientInput', {
    bindings: {
      ingredient: '<',
      category: '<',
      onRemove: '&',
      onIngredientChange: '&',
      onCategoryChange: '&'
    },
    controller: NewRecipeIngredientInputCtrl,
    controllerAs: 'vm',
    templateUrl: 'views/newRecipeIngredientInput.html'
  });
