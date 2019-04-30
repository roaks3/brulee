import * as express from 'express';
import { toExpress } from '../utils/express';
import * as controller from '../controllers/recipe.controller';

const router = express.Router();

router.get('/', toExpress(controller.index));
router.get('/:id', toExpress(controller.show));
router.post('/', toExpress(controller.create));
router.put('/:id', toExpress(controller.update));
router.delete('/:id', toExpress(controller.destroy));

export default router;
