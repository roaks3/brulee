'use strict';

class RecipeDayInputCtrl {

  constructor (Recipe) {
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

angular.module('bruleeApp')
  .component('recipeDayInput', {
    bindings: {
      recipeDay: '<',
      inputDisabled: '<',
      onDayChange: '&'
    },
    controller: RecipeDayInputCtrl,
    controllerAs: 'vm',
    templateUrl: 'components/recipeDayInput/recipeDayInput.html'
  });
