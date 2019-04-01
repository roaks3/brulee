import angular from 'angular';

import Category from '../scripts/datastores/Category';

class CategoryStore {

  constructor (Category) {
    'ngInject';

    this.Category = Category;
  }

  fetchAllCategories () {
    return this.Category
      .findAll()
      .then(categories => {
        this.categories = categories;
      });
  }

  createCategory (category) {
    return this.Category
      .create(_.pick(category, [
        'name',
        'order'
      ]))
      .then(() => {
        this.categories = this.Category.getAll();
      });
  }

  updateCategory (category) {
    return this.Category
      .update(category.id, _.pick(category, [
        'name',
        'order'
      ]))
      .then(() => {
        this.categories = this.Category.getAll();
      });
  }

  destroyCategory (categoryId) {
    return this.Category
      .destroy(categoryId)
      .then(() => {
        this.categories = this.Category.getAll();
      });
  }

  selectAllCategories () {
    return this.categories;
  }

  selectCategoryById (id) {
    return this.categories.find(category => category.id === id);
  }

  selectCategoriesForIngredients (ingredientIds) {
    return this.categories.filter(category => {
      return category.ingredient_ids.some(ingredientId => ingredientIds.includes(ingredientId));
    });
  }

}

export default angular.module('services.categoryStore', [Category])
  .service('categoryStore', CategoryStore)
  .name;
