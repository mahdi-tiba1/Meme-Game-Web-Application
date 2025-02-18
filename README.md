[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/AVMm0VzU)
# Exam #1: "Meme Game"
## Student: s323113 Tiba Mahdi

## React Client Application Routes

- Route `/`: Displays the homepage where users can decide to log in or play anoynymous.
- Route `/game`: Displays a random meme with multiple captions where users can select the best caption.
- Route `/history`: Shows the history of memes and scores for the logged-in user.
- Route `/login`: Shows login form of a user. 
- Route `/anonymousGame`: Displays an anonymous game for non logged in users.
- Route `/gameOver`: Displays the end of the game page with round history.


## Main React Components

- `LoginForm` (in `AuthComponents.jsx`): Handles user login/logout functionality. 
- `MemeGame` (in `MemeGame.jsx`): Displays a random meme with multiple captions for selection.
- `GameHistory` (in `GameHistory.jsx`): Displays the history of memes and scores for the logged-in user.
- `AnonymousGame` (in `AnonymousGame.jsx`): Displays an anonymous game for non logged in users.
- `GameOver` (in `GameOver.jsx`): Displays the end of the game page with round history.
- `PlayLayout` (in `GameStarterPage.jsx`): Displays the page where a user has the play button handling the functionality of starting a new game.



(only _main_ components, minor ones may be skipped)


## API Server

    
  - POST `/api/sessions`: User Login
  - Request Body: `{ "username", "password" }`
  - response body content: `{ id, "username" }`
  - response status codes and possible errors: `201 Created, 401 Unauthorized`

  - GET `/api/sessions/current`: Get current session
  - response body content: `{ "id": 1, "username": "user1" }`
  - response status codes and possible errors: `200 Created, 401 Unauthorized`

  - DELETE `/api/sessions/current`: logs out the current user
  - response status codes and possible errors: `200 OK`


  - GET `/api/meme`: Get a random meme with captions
  - response body content: `{ "meme": { ... }, "captions": [ ... ] }`
  - response status codes and possible errors: `200 OK, 401 Unauthorized`
  
- POST `/api/history`: Save meme game history
  - request parameters:`{ userId, memeId, score, gameId }`
  - response body content: `{ "message": "Score recorded" }`
  - response status codes and possible errors: `200 OK, 401 Unauthorized, 500 Internal Server Error`

- GET `/api/sum`: Get sum of scores for the logged-in user
  - request parameters and request body content: `userId from req`
  - response body content: `{ score }`
  - response status codes and possible errors: `200 OK, 401 Unauthorized, 500 Internal Server Error`
- ...

- GET `/api/gameHistory/totalScores`: Get total scores for a game of the logged-in user
  - request parameters and request body content: `userId from req`
  - response body content: `{ gameId, totalScore }`
  - response status codes and possible errors: `200 OK,  500 Internal Server Error`
- ...

- POST `/api/user_gameId`: Save game ID for a user
  - request parameters and request body content: `{ userId, gameId }`
  - response body content: `{ newGameId }`
  - response status codes and possible errors: `201 Created, 401 Unauthorized, 500 Internal Server Error`
- ...

- GET `/api/user_gameId/:userId`:  Get last game ID for a user
  - request parameters and request body content: `userId`
  - response body content: `{ "gameId" }`
  - response status codes and possible errors: `Status Codes: 200 OK, 401 Unauthorized, 404 Not Found, 500 Internal Server Error`
- ...

- GET `/api/gameCount/:userId`: Get count of games for a user
  - request parameters and request body content: `userId`
  - response body content: `{ gameCount }`
  - response status codes and possible errors: `Status Codes: 200 OK, 401 Unauthorized, 500 Internal Server Error`
- ...

- GET `/api/userMemeHistory/:userId`: Get meme history for a user
  - request parameters and request body content: `userId`
  - response body content:  `[ { history_id, user_id , score, game_id, "meme_url" } ]`
  - response status codes and possible errors: `Status Codes: 200 OK, 500 Internal Server Error`
- ...

## Database Tables

- Table `users` - Contains information about users registered in the system.( id , name , email , password,salt)

- Table `captions` -Stores the captions that can be matched with memes.( id ,text)
- Table `game_history`-ecords the history of games played, including the user, meme, score, and game id.(history_id , user_id , meme_id , game_id,score).
- Table `meme_captions`-Links memes to their captions and indicates if a caption is the best match.( id , meme_id caption_id , is_best_match)
- Table `memes`-Stores information about the memes available in the game.(id , url)
- Table `rounds`-Contains details about each round in a game, including the meme used, the selected caption, and the game it belongs to.(id , game_id , meme_url , selected_caption)
- Table `user_games`-Links users to the games they have played.(user_id , game_id) both fields are primary keys



## Screenshots

![Screenshot1](./screenshots/ss1.jpg)

![Screenshot2](./screenshots/ss2.jpg)


## Users Credentials

- m@gmail.com, mahdii
- mf@gmail.com , mouniff
