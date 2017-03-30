import angular from 'angular';

import template from './recipeListItem.html';
import './recipeListItem.scss';

class RecipeListItemCtrl {

  $onInit () {
    this.selected = false;
    this.tags = this.recipe.tags ? this.recipe.tags.split(',') : [];
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
