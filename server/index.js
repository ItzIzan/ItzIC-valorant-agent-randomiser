// Import required modules
const express = require('express');
const cors = require('cors');
const app = express();

// Load the agents data from JSON
const agents = require('./agents.json');

// Enable CORS to allow requests from the frontend (React app)
app.use(cors());

// Endpoint to get a random agent based on selected roles
app.get('/random', (req, res) => {
  // Get the 'roles' query parameter and split it into an array
  const roles = req.query.roles?.split(',') || [];

  // If no roles were provided, return an error
  if (roles.length === 0) {
    return res.status(400).json({ error: 'No roles selected' });
  }

  // Filter agents based on the selected roles (case-insensitive)
  const filteredAgents = agents.filter(agent =>
    roles.includes(agent.role.toLowerCase())
  );

  // If no agents match the selected roles, return an error
  if (filteredAgents.length === 0) {
    return res.status(404).json({ error: 'No agents found' });
  }

  // Select a random agent from the filtered list
  const randomAgent = filteredAgents[Math.floor(Math.random() * filteredAgents.length)];

  // Return the selected agent as JSON
  res.json(randomAgent);
});

// Start the server on port 5000
app.listen(5000, () => console.log('Server running on port 5000'));
