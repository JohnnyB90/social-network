const router = require('express').Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  removeFriend
} = require('../../controllers/userController');

// GET all users
router.get('/', getAllUsers);

// GET a single user by id
router.get('/:userId', getUserById);

// POST create a new user
router.post('/', createUser);

// PUT update a user by id
router.put('/:userId', updateUser);

// DELETE remove a user by id
router.delete('/:userId', deleteUser);

// POST add a friend to a user's friend list
router.post('/:userId/friends/:friendId', addFriend);

// DELETE remove a friend from a user's friend list
router.delete('/:userId/friends/:friendId', removeFriend);

module.exports = router;
