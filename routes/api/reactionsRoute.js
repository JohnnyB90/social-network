const router = require('express').Router();
const {
  addReaction,
  removeReaction,
  updateReaction,
  getReactions
} = require('../../controllers/reactionController');

// POST add a reaction to a thought
router.post('/:thoughtId/reactions', addReaction);

// PUT update a reaction from a thought
router.put('/:thoughtId/reactions/:reactionId', updateReaction);


// DELETE remove a reaction from a thought
router.delete('/:thoughtId/reactions/:reactionId', removeReaction);


// GET get all reactions
router.get('/', getReactions);

module.exports = router;
