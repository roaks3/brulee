import angular from 'angular';

import template from './recipeListItem.html';
import './recipeListItem.scss';

class RecipeListItemCtrl {

  $onInit () {
    this.selected = false;
  }

  toggleRecipe () {
    if (this.selected) {
      this.onSelectRecipe({recipe: this.recipe});
    } else {
      this.onUnselectRecipe({recipe: this.recipe});
    }
  }

}

export default angular
  .module('components.recipeListItem', [])
  .component('recipeListItem', {
    template,
    bindings: {
      recipe: '<',
      useCount: '<',
      onSelectRecipe: '&',
      onUnselectRecipe: '&'
    },
    controller: RecipeListItemCtrl
  })
  .name;
