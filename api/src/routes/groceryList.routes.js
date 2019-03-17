const { Router } = require('express');
const controller = require('../controllers/groceryList.controller');

const router = new Router();

router.get('/', controller.index);
router.get('/recent', controller.recent);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
