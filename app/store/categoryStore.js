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
        'name'
      ]))
      .then(() => {
        this.categories = this.Category.getAll();
      });
  }

  updateCategory (category) {
    return this.Category
      .update(category.id, _.pick(category, [
        'name',
        'display_order'
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

  selectCategoriesForIngredients (ingredients) {
    const categoryIds = ingredients.map(ingredient => ingredient.category_id)
    return this.categories.filter(category => categoryIds.includes(category.id));
  }

}

export default angular.module('services.categoryStore', [Category])
  .service('categoryStore', CategoryStore)
  .name;
