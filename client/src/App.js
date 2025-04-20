import React, { useState } from 'react';
import './App.css';

// List of available agent roles in Valorant
const rolesList = ['duelist', 'controller', 'initiator', 'sentinel'];

function App() {
  // State to track selected roles
  const [selectedRoles, setSelectedRoles] = useState([]);

  // State to hold the fetched agent info
  const [agent, setAgent] = useState(null);

  // State to show error messages
  const [error, setError] = useState('');

  // Toggle a role in the selection list (adds if not selected, removes if selected)
  const toggleRole = (role) => {
    setSelectedRoles(prev =>
      prev.includes(role)
        ? prev.filter(r => r !== role) // Remove role
        : [...prev, role]              // Add role
    );
  };

  // Function to fetch a random agent based on selected roles
  const fetchRandomAgent = async () => {
    // If no roles selected, show an error
    if (selectedRoles.length === 0) {
      setError('Please select at least one role.');
      setAgent(null);
      return;
    }

    try {
      // Send GET request to the backend with selected roles as query parameters
      const response = await fetch(`http://localhost:5000/random?roles=${selectedRoles.join(',')}`);

      // If the server responds with an error, show it
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong');
      }

      // If successful, update the agent state and clear error
      const data = await response.json();
      setAgent(data);
      setError('');
    } catch (err) {
      // Show any caught errors (like no agents found or network issues)
      setAgent(null);
      setError(err.message);
    }
  };

  return (
    <div className="App">
      <h1>Valorant Agent Randomiser</h1>

      {/* Role selection buttons */}
      <div className="roles">
        {rolesList.map(role => (
          <button
            key={role}
            className={selectedRoles.includes(role) ? 'selected' : ''}
            onClick={() => toggleRole(role)}
          >
            {role.charAt(0).toUpperCase() + role.slice(1)} {/* Capitalize first letter */}
          </button>
        ))}
      </div>

      {/* Button to trigger random agent selection */}
      <button className="randomise" onClick={fetchRandomAgent}>
        Randomise
      </button>

      {/* Error message display */}
      {error && <p className="error">{error}</p>}

      {/* Agent card display */}
      {agent && (
        <div className="agent-card">
          <h2>{agent.name}</h2>
          <p>{agent.role.charAt(0).toUpperCase() + agent.role.slice(1)}</p>
          <img src={agent.image} alt={agent.name} />
        </div>
      )}
    </div>
  );
}

export default App;
