// Get API URL from environment
const API_URL = import.meta.env.VITE_API_URL || "https://c45bjd0f8i.execute-api.us-west-2.amazonaws.com/prod";

// Generic API call function with error handling
async function apiCall(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json();

    // Handle token expiration
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error('Session expired. Please login again.');
    }

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Auth API
export const authAPI = {
  login: (username, password) => 
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    }),
};

// Tournaments API
export const tournamentsAPI = {
  getAll: () => apiCall('/tournaments'),
  
  getById: (id) => apiCall(`/tournaments/${id}`),
  
  create: (tournamentData) => 
    apiCall('/tournaments', {
      method: 'POST',
      body: JSON.stringify(tournamentData)
    }),
  
  update: (id, tournamentData) => 
    apiCall(`/tournaments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tournamentData)
    }),
  
  delete: (id) => 
    apiCall(`/tournaments/${id}`, { 
      method: 'DELETE' 
    })
};

// Teams API
export const teamsAPI = {
  getAll: (tournamentId = null) => {
    const url = tournamentId 
      ? `/teams?tournamentId=${tournamentId}` 
      : '/teams';
    return apiCall(url);
  },
  
  getById: (id) => apiCall(`/teams/${id}`),
  
  create: (teamData) => 
    apiCall('/teams', {
      method: 'POST',
      body: JSON.stringify(teamData)
    }),
  
  update: (id, teamData) => 
    apiCall(`/teams/${id}`, {
      method: 'PUT',
      body: JSON.stringify(teamData)
    }),
  
  delete: (id) => 
    apiCall(`/teams/${id}`, { 
      method: 'DELETE' 
    })
};

// Players API
export const playersAPI = {
  getAll: (teamId = null) => {
    const url = teamId 
      ? `/players?teamId=${teamId}` 
      : '/players';
    return apiCall(url);
  },
  
  getById: (id) => apiCall(`/players/${id}`),
  
  create: (playerData) => 
    apiCall('/players', {
      method: 'POST',
      body: JSON.stringify(playerData)
    }),
  
  update: (id, playerData) => 
    apiCall(`/players/${id}`, {
      method: 'PUT',
      body: JSON.stringify(playerData)
    }),
  
  delete: (id) => 
    apiCall(`/players/${id}`, { 
      method: 'DELETE' 
    })
};

// Matches API
export const matchesAPI = {
  getAll: (tournamentId = null) => {
    const url = tournamentId 
      ? `/matches?tournamentId=${tournamentId}` 
      : '/matches';
    return apiCall(url);
  },
  
  getById: (id) => apiCall(`/matches/${id}`),
  
  schedule: (matchData) => 
    apiCall('/matches', {
      method: 'POST',
      body: JSON.stringify(matchData)
    }),
  
  update: (id, matchData) => 
    apiCall(`/matches/${id}`, {
      method: 'PUT',
      body: JSON.stringify(matchData)
    }),
  
  // Update live score (without completing the match)
  updateLiveScore: (id, scoreData) => 
    apiCall(`/matches/${id}/live-score`, {
      method: 'PUT',
      body: JSON.stringify(scoreData)
    }),
  
  // Complete the match with final score
  score: (id, scoreData) => 
    apiCall(`/matches/${id}/score`, {
      method: 'PUT',
      body: JSON.stringify(scoreData)
    }),
  
  delete: (id) => 
    apiCall(`/matches/${id}`, { 
      method: 'DELETE' 
    })
};

// Standings API
export const standingsAPI = {
  getByTournament: (tournamentId) => 
    apiCall(`/standings?tournamentId=${tournamentId}`)
};

// Groups API
export const groupsAPI = {
  getAll: (tournamentId = null) => {
    const url = tournamentId 
      ? `/groups?tournamentId=${tournamentId}` 
      : '/groups';
    return apiCall(url);
  },
  
  getById: (id) => apiCall(`/groups/${id}`),
  
  create: (groupData) => 
    apiCall('/groups', {
      method: 'POST',
      body: JSON.stringify(groupData)
    }),
  
  update: (id, groupData) => 
    apiCall(`/groups/${id}`, {
      method: 'PUT',
      body: JSON.stringify(groupData)
    }),
  
  delete: (id) => 
    apiCall(`/groups/${id}`, { 
      method: 'DELETE' 
    }),
  
  addTeam: (groupId, teamId) => 
    apiCall(`/groups/${groupId}/teams`, {
      method: 'POST',
      body: JSON.stringify({ teamId })
    }),
  
  removeTeam: (groupId, teamId) => 
    apiCall(`/groups/${groupId}/teams/${teamId}`, {
      method: 'DELETE'
    })
};