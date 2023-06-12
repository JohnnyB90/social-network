const router = require('express').Router();
const {
  addReaction,
  removeReaction
} = require('../../controllers/reactionController');

// POST add a reaction to a thought
router.post('/:thoughtId/reactions', addReaction);

// DELETE remove a reaction from a thought
router.delete('/:thoughtId/reactions/:reactionId', removeReaction);

module.exports = router;
