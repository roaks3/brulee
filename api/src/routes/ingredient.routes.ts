import * as express from 'express';
import { toExpress } from '../utils/express';
import controller from '../controllers/ingredient.controller';

const router = express.Router();

router.get('/', toExpress(controller.index));
router.get('/:id', toExpress(controller.show));
router.post('/', toExpress(controller.create));
router.put('/:id', toExpress(controller.update));
router.delete('/:id', toExpress(controller.destroy));

export default router;
