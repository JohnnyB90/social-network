const router = require('express').Router();
const usersRoute = require('./usersRoute');
const reactionsRoute = require('./reactionsRoute');
const thoughtsRoute = require('./thoughtsRoute');

router.use('/users', usersRoute);
router.use('/reactions', reactionsRoute);
router.use('/thoughts', thoughtsRoute);

module.exports = router;