const { User } = require('../models');
const { Types: { ObjectId } } = require('mongoose');


const userController = {
  // GET all users
  getAllUsers(req, res) {
    User.find()
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
    const userId = params.userId;
    const objectIdUserId = new ObjectId(userId);

    User.findById(objectIdUserId)
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
    User.create(body)
      .then(user => res.json(user))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // PUT update a user by id
  updateUser({ params, body }, res) {
    const userId = params.userId;
    const objectIdUserId = new ObjectId(userId);

    User.findByIdAndUpdate(objectIdUserId, body, { new: true, runValidators: true })
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
    const userId = params.userId;
    const objectIdUserId = new ObjectId(userId);

    User.findByIdAndDelete(objectIdUserId)
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
    const { userId, friendId } = params;
    const objectIdUserId = new ObjectId(userId);
    const objectIdFriendId = new ObjectId(friendId);

    User.findByIdAndUpdate(
      objectIdUserId,
      { $addToSet: { friends: objectIdFriendId } },
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
    const { userId, friendId } = params;
    const objectIdUserId = new ObjectId(userId);
    const objectIdFriendId = new ObjectId(friendId);

    User.findByIdAndUpdate(
      objectIdUserId,
      { $pull: { friends: objectIdFriendId } },
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