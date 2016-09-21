'use strict';

class AddIngredientFormCtrl {

  constructor ($window) {
    this.$window = $window;
  }

  isNewIngredient () {
    return !(this.ingredient && this.ingredient.id);
  }

  addIngredient () {
    if (this.isNewIngredient()) {
      this.$window.alert('This ingredient is invalid and cannot be added');
    } else {
      this.onAdd({ingredient: this.ingredient});
      this.ingredient = null;
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
