import { db } from './db.mjs';
 

/** MEMES **/
export const getRandomMemeWithCaptions = () => {
  return new Promise((resolve, reject) => {
      db.get('SELECT * FROM memes ORDER BY RANDOM() LIMIT 1', (err, meme) => {
          if (err) {
              reject(err);
          } else {
              Promise.all([
                  new Promise((resolve, reject) => {
                      // Fetch the two correct captions for the meme along with is_best_match
                      db.all('SELECT c.*, mc.is_best_match FROM captions c JOIN meme_captions mc ON c.id = mc.caption_id WHERE mc.meme_id = ? AND mc.is_best_match = 1', meme.id, (err, rows) => {
                          if (err) {
                              reject(err);
                          } else {
                              resolve(rows);
                          }
                      });
                  }),
                  new Promise((resolve, reject) => {
                      // Fetch five random captions, excluding the correct ones
                      db.all('SELECT c.* FROM captions c WHERE c.id NOT IN (SELECT caption_id FROM meme_captions WHERE meme_id = ?) ORDER BY RANDOM() LIMIT 5', meme.id, (err, rows) => {
                          if (err) {
                              reject(err);
                          } else {
                              resolve(rows);
                          }
                      });
                  })
              ])
              .then(([correctCaptions, randomCaptions]) => {
                  let captions = [...correctCaptions, ...randomCaptions];

                  // Shuffle the captions
                  for (let i = captions.length - 1; i > 0; i--) {
                      const j = Math.floor(Math.random() * (i + 1));
                      [captions[i], captions[j]] = [captions[j], captions[i]];
                  }

                  resolve({ meme, captions });
              })
              .catch(err => reject(err));
          }
      });
  });
};

export const sendHistory = (userId, memeId, score ,gameId) => {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO game_history (user_id, meme_id, score ,game_id) VALUES (?, ?, ?,?)';
      db.run(sql, [userId, memeId, score ,gameId], (err) => {
        if (err) {
            console.error(err);
          reject(err);
        } else {
          resolve({ message: 'Score recorded' });
        }
      });
    });
  };
  
  
  // query to get sum of score group by userId from game_history
  export const getSumScore = (userId) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT SUM(score) as score FROM game_history WHERE user_id = ?';
      db.all(sql, [userId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          // Extract the score from the first row
          const sumScore = rows[0].score;
          resolve(sumScore);
        }
      });
    });
};


export const getTotalScoreForGame = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT game_id as gameId, SUM(score) as totalScore
      FROM game_history
      WHERE user_id = ?
      GROUP BY game_id
      HAVING COUNT(*) = 3
    `;
    db.all(sql, [userId], (err, rows) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};
 
export const saveGameId = (userId, gameId) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO user_games (user_id, game_id) VALUES (?, ?)';
    db.run(sql, [userId, gameId], function(err) {
      if (err) {
        console.error(`Failed to save game ID. UserId: ${userId}, GameId: ${gameId}`, err);
        reject(err);

      } else {
        console.log(`Successfully saved game ID. UserId: ${userId}, GameId: ${gameId}`);
        resolve(gameId);
      }
    });
  });
};




export const getLastGameIdd = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT game_id FROM user_games WHERE user_id = ? ORDER BY game_id DESC LIMIT 1';
    db.get(sql, [userId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row ? row.game_id : null);
      }
    });
  });
};

export const getGameCount = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT COUNT(*) as gameCount FROM user_games WHERE user_id = ?';
    db.get(sql, [userId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row ? row.gameCount : 0);
      }
    });
  });
};


export const getUserMemeHistory = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT gh.history_id, gh.user_id, gh.score,  gh.game_id, m.url AS meme_url
      FROM game_history gh
      INNER JOIN memes m ON gh.meme_id = m.id
      WHERE gh.user_id = ? AND gh.game_id IN (
        SELECT game_id
        FROM game_history
        WHERE user_id = ?
        GROUP BY game_id
        HAVING COUNT(*) = 3
      )
    `;
    
    db.all(sql, [userId, userId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};