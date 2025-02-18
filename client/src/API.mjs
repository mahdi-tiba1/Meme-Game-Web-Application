const SERVER_URL = 'http://localhost:3001';

const logIn = async (credentials) => {
  try {
    const response = await fetch(`${SERVER_URL}/api/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(credentials),
    });
    if (response.ok) {
      const user = await response.json();
      return user;
    } else {
      const errDetails = await response.text();
      throw new Error(errDetails);
    }
  } catch (error) {
    throw new Error('Failed to log in');
  }
};

const getUserInfo = async () => {
  try {
    const response = await fetch(`${SERVER_URL}/api/sessions/current`, {
      credentials: 'include',
    });
    if (response.ok) {
      const user = await response.json();
      return user;
    } else {
      throw new Error('Failed to retrieve logged in user');
    }
  } catch (error) {
    throw new Error('Failed to retrieve logged in user');
  }
};

const logOut = async () => {
  try {
    const response = await fetch(`${SERVER_URL}/api/sessions/current`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (response.ok) {
      return null;
    } else {
      throw new Error('Failed to log out');
    }
  } catch (error) {
    throw new Error('Failed to log out');
  }
};

const getMeme = async () => {
  try {
    const response = await fetch(`${SERVER_URL}/api/meme?anonymous=true`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Failed to fetch meme');
    }
  } catch (error) {
    throw new Error('Failed to fetch meme');
  }
};


export const sendHistoryToServer = async(userId, memeId, score ,gameId) => {
  try {
    const response = await fetch(`${SERVER_URL}/api/history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ userId, memeId, score ,gameId }),
    });
    if (!response.ok) {console.log(response);
      const errDetails = await response.text();
      throw new Error(errDetails);
    }
  } catch (error) {
    console.log(error);
    throw new Error('Failed to send history');
  }
};

// API.mjs
export const getUserMemeHistory = async (userId) => {
  try {
    const response = await fetch(`${SERVER_URL}/api/userMemeHistory/${userId}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      const data = await response.json();
     // console.log('Fetched data from server:', data);
      return data;
    } else {
      throw new Error('Failed to get user meme history');
    }
  } catch (error) {
    console.error('Error in fetch call:', error);
    throw new Error('Failed to get user meme history');
  }
};

export const getSumScore = async() => {
  try {
    const response = await fetch(`${SERVER_URL}/api/sum`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Failed to fetch history');
    }
  } catch (error) {
    throw new Error('Failed to fetch history');
  }
};

  
const getTotalScoreForGame = async () => {
  try {
    const response = await fetch(`${SERVER_URL}/api/gameHistory/totalScores`, {
      credentials: 'include',
    });
    if (response.ok) {
      const totalScores = await response.json();
      return totalScores;
    } else {
      throw new Error('Failed to retrieve total scores');
    }
  } catch (error) {
    throw new Error('Failed to retrieve total scores');
  }
};

 

export const postUserGameId = async (gameId, userId) => {
  try {
    const response = await fetch(`${SERVER_URL}/api/user_gameId`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, gameId }),
    });
    if (response.ok) {
      const data = await response.json();
      return data.newGameId;
    } else {
      throw new Error('Failed to post game data');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to post game data');
  }
};


export const getLastGameId = async (userId) => {
  try {
    const response = await fetch(`${SERVER_URL}/api/user_gameId/${userId}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      const data = await response.json();
      return data.gameId;
    } else {
      throw new Error('Failed to get game data');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get game data');
  }
};


export const getGameCount = async (userId) => {
  try {
    const response = await fetch(`${SERVER_URL}/api/gameCount/${userId}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      const data = await response.json();
      return data.gameCount;
    } else {
      throw new Error('Failed to get game count');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get game count');
  }
};

 

const API = { logIn, logOut, getUserInfo, getMeme ,sendHistoryToServer ,getUserMemeHistory,getSumScore,getTotalScoreForGame,postUserGameId,getLastGameId,getGameCount  };
export default API;