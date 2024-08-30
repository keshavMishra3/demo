const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const User = require('./models/user');
const Post = require('./models/post');
const connectDB = require('./config/dbConfig');

const generateFakePosts = async () => {
  try {
    await connectDB();

    // Fetch all users from the database
    const users = await User.find();

    if (users.length === 0) {
      throw new Error('No users found in the database.');
    }

    // Clear existing posts
    await Post.deleteMany();

    // Create 30 fake posts with titles like "Post 1", "Post 2", etc.
    const posts = [];
    for (let i = 1; i <= 30; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      posts.push({
        title: `Post ${i}`,
        body: faker.lorem.paragraph(),
        userId: user._id,
        date: faker.date.past(),
        reactions: {
          thumbsUp: faker.datatype.number({ min: 0, max: 10 }),
          wow: faker.datatype.number({ min: 0, max: 10 }),
          heart: faker.datatype.number({ min: 0, max: 10 }),
          rocket: faker.datatype.number({ min: 0, max: 10 }),
          coffee: faker.datatype.number({ min: 0, max: 10 })
        }
      });
    }

    // Insert fake posts into the database
    await Post.insertMany(posts);

    console.log('30 fake posts created successfully');
    mongoose.connection.close();
  } catch (err) {
    console.error('Error creating fake posts:', err);
    mongoose.connection.close();
  }
};

generateFakePosts();





