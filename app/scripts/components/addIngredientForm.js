'use strict';

class AddIngredientFormCtrl {

  isNewIngredient () {
    return !(this.ingredient && this.ingredient.id);
  }

  addIngredient () {
    if (this.isNewIngredient()) {
      // TODO: Show some sort of error because ingredient could not be added
    } else {
      this.onAdd({ingredient: this.ingredient});
    }
  }

  updateIngredient (ingredient) {
    this.ingredient = ingredient;
  }

}

angular.module('bruleeApp')
  .component('addIngredientForm', {
    bindings: {
      onAdd: '&'
    },
    controller: AddIngredientFormCtrl,
    controllerAs: 'vm',
    templateUrl: 'views/addIngredientForm.html'
  });
