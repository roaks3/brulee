import angular from 'angular';

import GroceryList from '../scripts/datastores/GroceryList';

class GroceryListStore {

  constructor (GroceryList) {
    'ngInject';

    this.GroceryList = GroceryList;
  }

  fetchGroceryListById (id) {
    return this.GroceryList
      .find(id)
      .then(() => {
        this.groceryLists = this.GroceryList.getAll();
      });
  }

  createGroceryList (groceryList) {
    return this.GroceryList
      .create({
        week_start: groceryList.week_start,
        recipe_days: _.map(groceryList.recipe_days, recipeDay => {
          return _.pick(recipeDay, ['recipe_id', 'day_of_week']);
        })
      })
      .then(() => {
        this.groceryLists = this.GroceryList.getAll();
      });
  }

  updateGroceryList (groceryList) {
    return this.GroceryList
      .update(groceryList.id, _.pick(groceryList, [
        'week_start',
        'recipe_days',
        'additional_ingredients'
      ]))
      .then(() => {
        this.groceryLists = this.GroceryList.getAll();
      });
  }

  selectGroceryListById (id) {
    return this.groceryLists.find(groceryList => groceryList.id === id);
  }

}

export default angular.module('services.groceryListStore', [GroceryList])
  .service('groceryListStore', GroceryListStore)
  .name;
