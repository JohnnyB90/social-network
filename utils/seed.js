// seed.js
const connection = require('../config/connection');
const { User, Thought, Reaction } = require('../models'); // Import the models
const { users, thoughts, reactions } = require('./data'); // Import the seed data

connection.on('error', (err) => err);

connection.once('open', async () => {
  console.log('connected');
  // Clear existing data from the collections (optional)
  await User.deleteMany({});
  await Thought.deleteMany({});
  await Reaction.deleteMany({});

  // Insert the seed data into the collections
  await User.collection.insertMany(users);
  await Thought.collection.insertMany(thoughts);
  await Reaction.collection.insertMany(reactions);

  // Log out the seed data to indicate what should appear in the database
  console.table(users);
  console.info('Seeding complete! 🌱');
  process.exit(0);
});
