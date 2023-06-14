// data.js for the seed.js
const users = [
    {
      username: 'user1',
      email: 'user1@example.com',
    },
    {
      username: 'user2',
      email: 'user2@example.com',
    },
  ];
  
  const thoughts = [
    {
      thoughtText: 'This is a sample thought.',
      username: 'user1',
    },
  ];
  
  const reactions = [
    {
      reactionBody: 'This is a sample reaction.',
      username: 'user1',
    },
  ];
  
  module.exports = {
    users,
    thoughts,
    reactions,
  };
  