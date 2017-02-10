'use strict';

class RecipeScheduleDayCtrl {

  constructor (groceryListPageStore) {
    this.groceryListPageStore = groceryListPageStore;
  }

  $onInit () {
    this.dayName = moment().day(this.dayOfWeek).format('dddd');
    this.isToday = moment().day() === this.dayOfWeek;
    this.recipes = this.groceryListPageStore.selectRecipesForDayOfWeek(this.dayOfWeek);
  }

}

angular.module('bruleeApp')
  .component('recipeScheduleDay', {
    bindings: {
      dayOfWeek: '<'
    },
    controller: RecipeScheduleDayCtrl,
    controllerAs: 'vm',
    templateUrl: 'components/recipeScheduleDay/recipeScheduleDay.html'
  });
