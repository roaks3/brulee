import angular from 'angular';

import recipeTypeahead from '../recipeTypeahead/recipeTypeahead';

import template from './addRecipeForm.html';
import './addRecipeForm.scss';

class AddRecipeFormCtrl {

  constructor ($window) {
    'ngInject';

    this.$window = $window;
  }

  addRecipe () {
    if (!this.recipe || !this.recipe.id) {
      this.$window.alert('This recipe is invalid and cannot be added');
    } else {
      this.onAdd({recipe: this.recipe});
      this.recipe = null;
    }
  }

  updateRecipe (recipe) {
    this.recipe = recipe;
  }

}

export default angular.module('components.addRecipeForm', [recipeTypeahead])
  .component('addRecipeForm', {
    template,
    bindings: {
      onAdd: '&'
    },
    controller: AddRecipeFormCtrl
  })
  .name;
