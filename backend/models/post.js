const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  reactions: {
    thumbsUp: { type: Number, default: 0 },
    wow: { type: Number, default: 0 },
    heart: { type: Number, default: 0 },
    rocket: { type: Number, default: 0 },
    coffee: { type: Number, default: 0 }
  }
});

module.exports = mongoose.model('Post', postSchema);
