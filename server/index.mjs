
// imports
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import {check, validationResult} from 'express-validator';
import {getUser} from './user-dao.mjs';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';
import {  getRandomMemeWithCaptions,sendHistory  ,getUserMemeHistory, getSumScore  , getTotalScoreForGame ,saveGameId, getLastGameIdd,getGameCount } from './memeDao.mjs';

// init express
const app = new express();
const port = 3001;


// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
// set up and enable CORS -- UPDATED
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
  credentials: true
};
app.use(cors(corsOptions));

// Passport: set up local strategy 
//
passport.use(new LocalStrategy(async function verify(username, password, cb) {
  const user = await getUser(username, password);
  if(!user)
    return cb(null, false, 'Incorrect username or password.');
    
  return cb(null, user);
}));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) { // this user is id + email + name
  return cb(null, user);
   
});

// Example middleware for protecting routes
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: 'Not authorized' });
};

app.use(session({
  secret: "shhhhh... it's a secret!",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));


// Example route using isLoggedIn middleware
app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
  console.log("no logged in user");
    res.status(401).json({ error: 'Not authenticated' });
  }
});



//Routes


// GET /api/sessions/current 
app.get('/api/sessions/current', (req, res) => {
  if(req.isAuthenticated()) {
    res.json(req.user);}
  else
    res.status(401).json({error: 'Not authenticated'});
});


// POST /api/sessions 
app.post('/api/sessions', function(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).send(info);
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(201).json(req.user);
    });
  })(req, res, next);
});




// DELETE /api/session/current 
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.end();
  });
});


// getting a meme and 7 captions to display
app.get('/api/meme', async (req, res) => {
  if (!req.isAuthenticated() && !req.query.anonymous) {
    return res.status(401).send('Unauthorized');
  }
  const { meme, captions } = await getRandomMemeWithCaptions();
  res.json({ meme, captions });
});




app.post('/api/history', async (req, res) => {
  const { userId, memeId, score,gameId } = req.body;
  if (!req.isAuthenticated()) {
    return res.status(401).send('Unauthorized');
  }
  try {
    await sendHistory(userId, memeId, score  ,gameId);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});


app.get('/api/sum', isLoggedIn, async (req, res) => {
  const userId = req.user.id;
  try {
    const sum = await getSumScore(userId);
    res.status(200).json(sum);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


 
app.get('/api/gameHistory/totalScores', isLoggedIn, async (req, res) => {
  const userId = req.user.id;
  try {
    const totalScores = await getTotalScoreForGame(userId);
    res.status(200).json(totalScores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




app.get('/api/user_gameId/:userId', isLoggedIn, async (req, res) => {
  const userId = req.params.userId;
  try {
    const gameId = await getLastGameIdd(userId);
    if (gameId !== null) {
      res.status(200).json({ gameId });
    } else {
      res.status(404).json({ error: 'Game not found for this user' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});



 
 
app.post('/api/user_gameId', isLoggedIn, async (req, res) => {
  const { userId, gameId } = req.body;
  console.log(`Received request to save game ID. UserId: ${userId}, GameId: ${gameId}`);

  try {
    const newGameId = await saveGameId(userId, gameId);
    res.status(201).json({ newGameId });
  } catch (error) {
    console.error(`Error saving game ID. UserId: ${userId}, GameId: ${gameId}`, error);

    
    res.status(500).json({ error: 'Failed to post game data' });
  }
});

   

 
app.get('/api/gameCount/:userId', isLoggedIn, async (req, res) => {
  const userId = req.params.userId;
  try {
    const gameCount = await getGameCount(userId);
    res.status(200).json({ gameCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});


 
 

app.get('/api/userMemeHistory/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log('Fetching history for userId:', userId);
    const history = await getUserMemeHistory(userId);
    console.log('Fetched history:', history);
    res.json(history);
  } catch (error) {
    console.error('Error fetching user meme history:', error);
    res.status(500).send('Failed to get user meme history');
  }
});



// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
