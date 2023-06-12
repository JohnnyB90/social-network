const { Users } = require('../models');

const userController = {
  // GET all users
  getAllUsers(req, res) {
    Users.find()
      .populate('thoughts')
      .populate('friends')
      .then(users => res.json(users))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // GET a single user by id
  getUserById({ params }, res) {
    Users.findById(params.userId)
      .populate('thoughts')
      .populate('friends')
      .then(user => {
        if (!user) {
          res.status(404).json({ message: 'No user found with this id' });
          return;
        }
        res.json(user);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // POST create a new user
  createUser({ body }, res) {
    Users.create(body)
      .then(user => res.json(user))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // PUT update a user by id
  updateUser({ params, body }, res) {
    Users.findByIdAndUpdate(params.userId, body, { new: true, runValidators: true })
      .then(user => {
        if (!user) {
          res.status(404).json({ message: 'No user found with this id' });
          return;
        }
        res.json(user);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // DELETE remove a user by id
  deleteUser({ params }, res) {
    Users.findByIdAndDelete(params.userId)
      .then(user => {
        if (!user) {
          res.status(404).json({ message: 'No user found with this id' });
          return;
        }
        res.json(user);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // POST add a friend to a user's friend list
  addFriend({ params }, res) {
    Users.findByIdAndUpdate(
      params.userId,
      { $addToSet: { friends: params.friendId } },
      { new: true, runValidators: true }
    )
      .then(user => {
        if (!user) {
          res.status(404).json({ message: 'No user found with this id' });
          return;
        }
        res.json(user);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // DELETE remove a friend from a user's friend list
  removeFriend({ params }, res) {
    Users.findByIdAndUpdate(
      params.userId,
      { $pull: { friends: params.friendId } },
      { new: true, runValidators: true }
    )
      .then(user => {
        if (!user) {
          res.status(404).json({ message: 'No user found with this id' });
          return;
        }
        res.json(user);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  }
};

module.exports = userController;
