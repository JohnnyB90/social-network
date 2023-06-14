const { Reaction } = require('../models');

const reactionController = {
  // POST add a reaction to a thought
  addReaction({ params, body }, res) {
    Reaction.create(body)
      .then(reaction => {
        return Thought.findByIdAndUpdate(
          params.thoughtId,
          { $push: { reactions: reaction._id } },
          { new: true, runValidators: true }
        );
      })
      .then(thought => {
        if (!thought) {
          res.status(404).json({ message: 'No thought found with this id' });
          return;
        }
        res.json(thought);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // DELETE remove a reaction from a thought
  removeReaction({ params }, res) {
    Reaction.findByIdAndDelete(params.reactionId)
      .then(deletedReaction => {
        if (!deletedReaction) {
          res.status(404).json({ message: 'No reaction found with this id' });
          return;
        }
        return Thought.findByIdAndUpdate(
          params.thoughtId,
          { $pull: { reactions: params.reactionId } },
          { new: true, runValidators: true }
        );
      })
      .then(thought => {
        if (!thought) {
          res.status(404).json({ message: 'No thought found with this id' });
          return;
        }
        res.json(thought);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  }
};

module.exports = reactionController;
