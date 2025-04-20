import React, { useState } from 'react';
import './App.css';

const rolesList = ['duelist', 'controller', 'initiator', 'sentinel'];

function App() {
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [agent, setAgent] = useState(null);
  const [error, setError] = useState('');
  const [bannedAgents, setBannedAgents] = useState([]); // New state for banned agents

  const toggleRole = (role) => {
    setSelectedRoles(prev =>
      prev.includes(role)
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  const fetchRandomAgent = async () => {
    if (selectedRoles.length === 0) {
      setError('Please select at least one role.');
      setAgent(null);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/random?roles=${selectedRoles.join(',')}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong');
      }
      const data = await response.json();
      if (bannedAgents.includes(data.name)) {
        setError('This agent is banned! Pick another one.');
        setAgent(null);
      } else {
        setAgent(data);
        setError('');
      }
    } catch (err) {
      setAgent(null);
      setError(err.message);
    }
  };

  const handleBanAgent = (agentName) => {
    setBannedAgents((prevBanned) => [...prevBanned, agentName]);
  };

  const resetBannedList = () => {
    setBannedAgents([]); // Reset the banned agents list
  };

  return (
    <div className="App">
      <h1>Valorant Agent Randomiser</h1>

      <div className="roles">
        {rolesList.map(role => (
          <button
            key={role}
            className={selectedRoles.includes(role) ? 'selected' : ''}
            onClick={() => toggleRole(role)}
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        ))}
      </div>

      <button className="randomise" onClick={fetchRandomAgent}>Randomise</button>

      {error && <p className="error">{error}</p>}

      {agent && (
        <div className="agent-card">
          <h2>{agent.name}</h2>
          <p>{agent.role.charAt(0).toUpperCase() + agent.role.slice(1)}</p>
          <img src={agent.image} alt={agent.name} />
          <button onClick={() => handleBanAgent(agent.name)}>Ban this agent</button>
        </div>
      )}

      <div className="banned-agents">
        <h3>Banned Agents</h3>
        <ul>
          {bannedAgents.map(agent => (
            <li key={agent}>{agent}</li>
          ))}
        </ul>
        <button className="reset-banned" onClick={resetBannedList}>Reset Banned List</button>
      </div>
    </div>
  );
}

export default App;
