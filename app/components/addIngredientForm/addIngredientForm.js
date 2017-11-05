import angular from 'angular';

import ingredientTypeahead from '../ingredientTypeahead/ingredientTypeahead';

import template from './addIngredientForm.html';
import './addIngredientForm.scss';

class AddIngredientFormCtrl {

  constructor ($window) {
    'ngInject';

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

export default angular.module('components.addIngredientForm', [ingredientTypeahead])
  .component('addIngredientForm', {
    template,
    bindings: {
      onAdd: '&'
    },
    controller: AddIngredientFormCtrl
  })
  .name;
