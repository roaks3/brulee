'use strict';

class RecipeScheduleDayCtrl {

  $onInit () {
    this.dayName = moment().day(this.dayOfWeek).format('dddd');
    this.isToday = moment().day() === this.dayOfWeek;
  }

}

angular.module('bruleeApp')
  .component('recipeScheduleDay', {
    bindings: {
      dayOfWeek: '<',
      recipes: '<'
    },
    controller: RecipeScheduleDayCtrl,
    controllerAs: 'vm',
    templateUrl: 'views/recipeScheduleDay.html'
  });
