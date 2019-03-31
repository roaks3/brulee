const { Router } = require('express');
const categoryRoutes = require('./routes/category.routes');
const gorceryListRoutes = require('./routes/groceryList.routes');
const ingredientRoutes = require('./routes/ingredient.routes');
const recipeRoutes = require('./routes/recipe.routes');
const pg = require('./services/pg.service');

const router = new Router();

router.use('/categories', categoryRoutes);
router.use('/groceryLists', gorceryListRoutes);
router.use('/ingredients', ingredientRoutes);
router.use('/recipes', recipeRoutes);

module.exports = {
  router,
  destroy: async () => pg.knex.destroy()
};
