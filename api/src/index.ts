import * as express from 'express';
import categoryRoutes from './routes/category.routes';
import gorceryListRoutes from './routes/groceryList.routes';
import ingredientRoutes from './routes/ingredient.routes';
import recipeRoutes from './routes/recipe.routes';
import * as pg from './services/pg.service';

export const router = express.Router();

router.use('/categories', categoryRoutes);
router.use('/groceryLists', gorceryListRoutes);
router.use('/ingredients', ingredientRoutes);
router.use('/recipes', recipeRoutes);

router.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    res.status(500).send(err.message);
  }
);

export const destroy = async (): Promise<void> => pg.knex.destroy();
