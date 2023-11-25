// Create web server with express
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const app = express();

// Use body-parser middleware
app.use(bodyParser.json());
app.use(cors());

// Create comments object
const commentsByPostId = {};

// Handle event from event-bus
app.post('/events', async (req, res) => {
  const { type, data } = req.body;

  if (type === 'CommentCreated') {
    const { id, content, postId, status } = data;

    // Add new comment to comments object
    const comments = commentsByPostId[postId] || [];
    comments.push({ id, content, status });
    commentsByPostId[postId] = comments;

    // Send event to event-bus
    await axios.post('http://event-bus-srv:4005/events', {
      type: 'CommentModerated',
      data: { id, content, postId, status },
    });
  }

  if (type === 'CommentUpdated') {
    const { id, content, postId, status } = data;

    // Find comment in comments object
    const comments = commentsByPostId[postId];
    const comment = comments.find((comment) => comment.id === id);

    // Update comment status
    comment.status = status;

    // Send event to event-bus
    await axios.post('http://event-bus-srv:4005/events', {
      type: 'CommentUpdated',
      data: { id, content, postId, status },
    });
  }

  res.send({});
});

// Get comments by post id
app.get('/posts/:id/comments', (req, res) => {
  const comments = commentsByPostId[req.params.id] || [];
  res.send(comments);
});

// Listen on port 4001
app.listen(4001, () => {
  console.log('Listening on port 4001');
});
