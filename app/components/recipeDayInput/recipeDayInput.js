import angular from 'angular';

import Recipe from '../../scripts/datastores/Recipe';
import dayOfWeekSelect from '../dayOfWeekSelect/dayOfWeekSelect';

import template from './recipeDayInput.html';

class RecipeDayInputCtrl {

  constructor (Recipe) {
    'ngInject';

    this.Recipe = Recipe;
    this.recipe = {};
  }

  $onInit () {
    this.Recipe
      .find(this.recipeDay.recipe_id)
      .then((data) => {
        this.recipe = data;
      });
  }

}

export default angular.module('components.recipeDayInput', [Recipe, dayOfWeekSelect])
  .component('recipeDayInput', {
    template,
    bindings: {
      recipeDay: '<',
      inputDisabled: '<',
      onDayChange: '&'
    },
    controller: RecipeDayInputCtrl,
    controllerAs: 'vm'
  })
  .name;
