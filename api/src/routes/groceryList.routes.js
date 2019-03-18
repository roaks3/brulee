const { Router } = require('express');
const { toExpress } = require('../utils/express');
const controller = require('../controllers/groceryList.controller');

const router = new Router();

router.get('/', toExpress(controller.index));
router.get('/recent', toExpress(controller.recent));
router.get('/:id', toExpress(controller.show));
router.post('/', toExpress(controller.create));
router.put('/:id', toExpress(controller.update));
router.delete('/:id', toExpress(controller.destroy));

module.exports = router;
