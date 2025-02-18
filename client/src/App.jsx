
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { Container, Row, Alert } from 'react-bootstrap';
import { Routes, Route, Outlet, Navigate, useNavigate } from 'react-router-dom';
import NavHeader from './components/NavHeader';
import { PlayLayout } from './components/GameStarterPage';
import NotFound from './components/NotFoundComponent';
import { LoginForm } from './components/AuthComponents';
import MemeGame from './components/MemeGame';
import GameHistory from './components/GameHistory';
import AnonymousGame from './components/AnonymousGame';
 
import API from './API.mjs';
import GameOver from './components/GameOver';

function App() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [gameId, setGameId] = useState(0) ; 
  const [roundHistory, setRoundHistory] = useState([]); // State for roundHistory


  useEffect(() => {

    // Set initial gameId in local storage to 0
   
    const checkAuth = async () => {
      if (!isAnonymous) {
         
          const user = await API.getUserInfo();
          console.log('User Info:', user);
          setLoggedIn(true);
          setUser(user);
        }  
        else {
        setLoggedIn(false);
        setIsAnonymous(true);
        setUser('');
        //navigate('/forbidden');
      }
    };
    checkAuth();
  }, []);


  useEffect(() => {
    if (user) {
      //console.log(user);
      getLastId(user.id);
    }
  }, [user]);

   
   

  const getLastId = async (userId) => {
    try {
      const gameCount = await API.getGameCount(userId);
      if (gameCount === 0) {
        //console.log('no games found for user:'+user.id+' setting gameId to 0');
        setGameId(0);
         
      } else {
        const lastGameId = await API.getLastGameId(userId);
        //console.log('last found id for user: '+user.id+' is '+lastGameId);
        // If lastGameId is undefined or null, set gameId to 0
        setGameId(lastGameId ?? 0);
      }
    } catch (error) {
      console.error(error);
    }
  };


 


  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setIsAnonymous(false);
      setMessage({ msg: `Welcome, ${user.name}!`, type: 'success' });
      setUser(user);
       
      
      
    } catch (err) {
      setMessage({ msg: err.message, type: 'danger' });
    }
  };

  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    setMessage('');
    setIsAnonymous(true);
    navigate('/login');
  };

  const handlePlayAsAnonymous = () => {
    setIsAnonymous(true);
    setLoggedIn(false);
    navigate('/anonymousGame');
  };


  const resetRoundHistory = () => setRoundHistory([]); // Function to reset roundHistory

  return (
    <Routes>
      <Route
        element={
          <>
            <NavHeader loggedIn={loggedIn} handleLogout={handleLogout} />
            <Container fluid className="mt-3">
              {message && (
                <Row>
                  <Alert variant={message.type} onClose={() => setMessage('')} dismissible>
                    {message.msg}
                  </Alert>
                </Row>
              )}
              <Outlet />
            </Container>
          </>
        }
      >
        <Route
          index
          element={<PlayLayout loggedIn={loggedIn} user={user} anonymous={handlePlayAsAnonymous}   setGameId={setGameId}  resetRoundHistory={resetRoundHistory}  />}
        />
        <Route path="*" element={<NotFound />} />
        <Route
          path="/login"
          element={
            loggedIn ? (
              <Navigate replace to="/" />
            ) : (
              <div>
                <LoginForm login={handleLogin} />
              </div>
            )
          }
        />
        <Route
          path="/game"
          element={
            <MemeGame
              user={user}
              setRoundHistory={setRoundHistory} // Pass setRoundHistory to MemeGame
              roundHistory={roundHistory}    
            />
          }
        />
        <Route path="/history" element={<GameHistory user={user}  />} />
        <Route path="/anonymousGame" element={<AnonymousGame />} />
        <Route path="/GameOver" element={<GameOver  loggedIn={loggedIn} gameId={gameId} setGameId={setGameId}  resetRoundHistory={resetRoundHistory} anonymous={handlePlayAsAnonymous} />} />      </Route>
    </Routes>
  );
}

export default App;