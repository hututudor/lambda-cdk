const Router = require('./kata/router');
const todo = require('./controllers/todo');

const router = new Router();

router.get('/', todo.getAll);
router.put('/', todo.add);
router.post('/', todo.update);
router.delete('/', todo.remove);

module.exports = router;