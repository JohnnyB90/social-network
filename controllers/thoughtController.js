const { Thoughts, Users } = require('../models');

const thoughtController = {
  // GET all thoughts
  getAllThoughts(req, res) {
    Thoughts.find({})
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
    Thoughts.findById(params.thoughtId)
      .populate({ path: 'reactions', select: '-__v' })
      .select('-__v')
      .then((thought) => {
        if (!this.deleteThought) {
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
    Thoughts.create(body)
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
    Thoughts.findByIdAndUpdate(params.thoughtId, body, { new: true, runValidators: true })
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
    Thoughts.findByIdAndDelete(params.thoughtId)
      .then((thought) => {
        if (!thought) {
          res.status(404).json({ message: 'No thought found with this id!' });
          return;
        }
        return User.findByIdAndUpdate(
          thought.userId,
          { $pull: { thoughts: params.thoughtId } },
          { new: true }
        );
      })
      .then(() => {
        res.json({ message: 'Thought deleted successfully!' });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // POST add a reaction to a thought
  addReaction({ params, body }, res) {
    Thoughts.findByIdAndUpdate(
      params.thoughtId,
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
          Thoughts.findByIdAndUpdate(
          params.thoughtId,
          { $pull: { reactions: { reactionId: params.reactionId } } },
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
          },
          };
          
          module.exports = thoughtController;
