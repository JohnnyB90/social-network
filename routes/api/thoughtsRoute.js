const router = require('express').Router();
const {
  getAllThoughts,
  getThoughtById,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
  removeReaction
} = require('../../controllers/thoughtController');

// GET all thoughts
router.get('/', getAllThoughts);

// GET a single thought by id
router.get('/:thoughtId', getThoughtById);

// POST create a new thought
router.post('/', createThought);

// PUT update a thought by id
router.put('/:thoughtId', updateThought);

// DELETE remove a thought by id
router.delete('/:thoughtId', deleteThought);

// POST add a reaction to a thought
router.post('/:thoughtId/reactions', addReaction);

// DELETE remove a reaction from a thought
router.delete('/:thoughtId/reactions/:reactionId', removeReaction);

module.exports = router;
