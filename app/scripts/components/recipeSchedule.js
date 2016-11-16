'use strict';

class RecipeScheduleCtrl {

  constructor (groceryListService) {
    this.groceryListService = groceryListService;
    this.days = _.range(0, 7);
  }

  $onInit () {
    let recipeIds = _.map(this.recipeDays, 'recipe_id');

    this.groceryListService
      .findAllRecipesById(recipeIds)
      .then((recipes) => {
        this.recipesByDay = _(this.recipeDays)
          .groupBy('day_of_week')
          .mapValues((recipeDays) => {
            return _.map(recipeDays, (recipeDay) => {
              return _.find(recipes, {id: recipeDay.recipe_id});
            });
          })
          .value();
      });
  }

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
