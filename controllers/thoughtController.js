const { Thought, User } = require('../models');
const { Types: { ObjectId } } = require('mongoose');

const thoughtController = {
  // GET all thoughts
  getAllThoughts(req, res) {
    Thought.find({})
      .populate({ path: 'reactions', select: '-__v' })
      .select('-__v')
      .sort({ createdAt: -1 })
      .then((thoughts) => res.json(thoughts))
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // GET a single thought by id
  getThoughtById({ params }, res) {
    const thoughtId = params.thoughtId;
    const objectIdThoughtId = new ObjectId(thoughtId);

    Thought.findById(objectIdThoughtId)
      .populate({ path: 'reactions', select: '-__v' })
      .select('-__v')
      .then((thought) => {
        if (!thought) {
          res.status(404).json({ message: 'No thought found with this id!' });
          return;
        }
        res.json(thought);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // POST create a new thought
  createThought({ body }, res) {
    Thought.create(body)
      .then(({ _id }) => {
        return User.findByIdAndUpdate(
          body.userId,
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json({ message: 'Thought created successfully!' });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

// PUT update a thought by id
updateThought({ params, body }, res) {
  const thoughtId = params.thoughtId;
  const objectIdThoughtId = new ObjectId(thoughtId);

  Thought.findByIdAndUpdate(objectIdThoughtId, body, { new: true })
    .then((thought) => {
      if (!thought) {
        res.status(404).json({ message: 'No thought found with this id!' });
        return;
      }
      res.json({ message: 'Thought updated successfully!' });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
},

// DELETE remove a thought by id
deleteThought({ params }, res) {
  const thoughtId = params.thoughtId;
  const objectIdThoughtId = new ObjectId(thoughtId);

  Thought.findByIdAndDelete(objectIdThoughtId)
    .then((thought) => {
      if (!thought) {
        res.status(404).json({ message: 'No thought found with this id!' });
        return;
      }
      return User.findById(thought.userId);
    })
    .then((user) => {
      if (!user) {
        res.json({ message: 'Thought deleted successfully!' });
        return;
      }
      return User.findByIdAndUpdate(
        user._id,
        { $pull: { thoughts: params.thoughtId } },
        { new: true }
      );
    })
    .then(() => {
      if (!res.headersSent) {
        res.json({ message: 'Thought deleted successfully!' });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
},



  // POST add a reaction to a thought
  addReaction({ params, body }, res) {
    const thoughtId = params.thoughtId;
    const objectIdThoughtId = new ObjectId(thoughtId);

    Thought.findByIdAndUpdate(
      objectIdThoughtId,
      { $push: { reactions: body } },
      { new: true, runValidators: true }
    )
      .populate({ path: 'reactions', select: '-__v' })
      .select('-__v')
      .then((thought) => {
        if (!thought) {
          res.status(404).json({ message: 'No thought found with this id!' });
          return;
        }
        res.json({ message: 'Reaction added successfully!', thought });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // DELETE remove a reaction from a thought
  removeReaction({ params }, res) {
    const thoughtId = params.thoughtId;
    const reactionId = params.reactionId;
    const objectIdThoughtId = new ObjectId(thoughtId);
    const objectIdReactionId = new ObjectId(reactionId);

    Thought.findByIdAndUpdate(
      objectIdThoughtId,
      { $pull: { reactions: { _id: objectIdReactionId } } },
      { new: true }
    )
      .populate({ path: 'reactions', select: '-__v' })
      .select('-__v')
      .then((thought) => {
        if (!thought) {
          res.status(404).json({ message: 'No thought found with this id!' });
          return;
        }
        res.json({ message: 'Reaction removed successfully!', thought });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  }
};

module.exports = thoughtController;
