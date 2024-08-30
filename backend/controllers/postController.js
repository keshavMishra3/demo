const Post = require('../models/post');

// Get all posts
const getAllPosts = async (req, res) => {
  try {
    console.log("working...");

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    console.log("page:", page);
    console.log("limit:", limit);

    const skip = (page - 1) * limit;

    const posts = await Post.find().skip(skip).limit(limit).exec();
    const totalPosts = await Post.countDocuments().exec();

    const hasNextPage = totalPosts > page * limit;
    console.log("hasNextPage:", hasNextPage);

    res.json({
      posts,
      hasNextPage,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




// Get post by ID
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post == null) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new post
const createPost = async (req, res) => {
  const post = new Post(req.body);
  try {
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updatePostReactions = async (req, res) => {
  
  try {
      const { id } = req.params;
      
      const { reactions } = req.body;

      // Find and update the post
      const post = await Post.findById(id);
      if (!post) {
          return res.status(404).json({ message: 'Post not found' });
      }

      // Update reactions
      post.reactions = reactions;
      await post.save();

      res.status(200).json(post);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
};

const updatePost = async (req, res) => {
  try {
      const { id } = req.params;
      console.log(id)
      const updatedPost = await Post.findByIdAndUpdate(id, req.body);

      if (!updatedPost) {
          return res.status(404).json({ message: 'Post not found' });
      }

      res.json(updatedPost);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
  }
};

const deletePost = async (req, res) => {
  try {
      const { id } = req.params;
      
      // Ensure id is provided
      if (!id) {
          return res.status(400).json({ message: 'Post ID is required' });
      }

      // Find and delete the post
      const deletedPost = await Post.findByIdAndDelete(id);

      // Check if post was found and deleted
      if (!deletedPost) {
          return res.status(404).json({ message: 'Post not found' });
      }

      res.status(200).json({ message: 'Post deleted successfully', post: deletedPost });
  } catch (error) {
      console.error('Error deleting post:', error);
      res.status(500).json({ message: 'Failed to delete post', error });
  }
};

const getPostsByUserId = async (req, res) => {
  
  try {
      const { userId } = req.params;

      // Ensure userId is provided
      if (!userId) {
          return res.status(400).json({ message: 'User ID is required' });
      }

      // Find posts by userId
      const posts = await Post.find({ userId });

      // Check if posts were found
      if (posts.length === 0) {
          return res.status(404).json({ message: 'No posts found for this user' });
      }

      res.status(200).json(posts);
  } catch (error) {
      console.error('Error retrieving posts by userId:', error);
      res.status(500).json({ message: 'Failed to retrieve posts', error });
  }
};


module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePostReactions,
  updatePost ,
  deletePost,
 getPostsByUserId 

};
