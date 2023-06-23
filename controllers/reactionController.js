const { Reaction } = require('../models');
const { Thought } = require('../models');

const reactionController = {
// POST add a reaction to a thought
addReaction({ params, body }, res) {
  Reaction.create(body)
    .then(reaction => {
      return Promise.all([
        Thought.findByIdAndUpdate(
          params.thoughtId,
          { $push: { reactions: reaction._id } },
          { new: true, runValidators: true }
        ),
        User.findOneAndUpdate(
          { username: body.username },
          { $push: { reactions: reaction._id } },
          { new: true, runValidators: true }
        )
      ]);
    })
    .then(([thought, user]) => {
      if (!thought) {
        res.status(404).json({ message: 'No thought found with this id' });
        return;
      }
      if (!user) {
        res.status(404).json({ message: 'No user found with this username' });
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
          return res.status(404).json({ message: 'No reaction found with this id' });
        }
        return Thought.findByIdAndUpdate(
          params.thoughtId,
          { $pull: { reactions: params.reactionId } },
          { new: true }
        );
      })
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(404).json({ message: 'No thought found with this id' });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(err => res.json(err));
  },

 // PUT update a reaction
 updateReaction({ params, body }, res) {
  console.log('Updating reaction...');
  Reaction.findByIdAndUpdate(
    params.reactionId,
    body,
    { new: true, runValidators: true }
  )
    .then(updatedReaction => {
      if (!updatedReaction) {
        res.status(404).json({ message: 'No reaction found with this id' });
        return;
      }
      res.json(updatedReaction);
    })
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });
},

// GET all reactions
getReactions(req, res) {
  Thought.find()
    .populate('reactions')
    .select('-__v')
    .then(thoughts => {
      const reactions = thoughts.reduce((acc, thought) => {
        acc.push(...thought.reactions.map(reaction => {
          return {
            thoughtId: thought._id,
            reactionId: reaction._id,
            reactionBody: reaction.reactionBody,
            username: reaction.username,
            createdAt: reaction.createdAt
          };
        }));
        return acc;
      }, []);
      res.json(reactions);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
}

};

module.exports = reactionController;
