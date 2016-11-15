'use strict';

class RecipeScheduleCtrl {
}

angular.module('bruleeApp')
  .component('recipeSchedule', {
    bindings: {
      recipeDays: '<'
    },
    controller: RecipeScheduleCtrl,
    controllerAs: 'vm',
    templateUrl: 'views/recipeSchedule.html'
  });
