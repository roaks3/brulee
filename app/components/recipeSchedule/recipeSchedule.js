'use strict';

class RecipeScheduleCtrl {

  $onInit () {
    this.days = _.range(0, 7);
  }

}

angular.module('bruleeApp')
  .component('recipeSchedule', {
    controller: RecipeScheduleCtrl,
    controllerAs: 'vm',
    templateUrl: 'components/recipeSchedule/recipeSchedule.html'
  });
