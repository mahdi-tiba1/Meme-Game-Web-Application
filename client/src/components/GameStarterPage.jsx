import { Row, Col, Button,Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
 
import API from '../API.mjs';
 
export function PlayLayout({ loggedIn, anonymous,   setGameId , resetRoundHistory,user  }) {
    const navigate = useNavigate();
    
    const startNewGame = async () => {
        if (loggedIn) {
            try {
                const gameCount = await API.getGameCount(user.id);
                if (gameCount === 0) {
                   // console.log('no games found for user:'+user.id+' setting gameId to 0');
                     
                    const lastGameId= 0 ;
                    const newGameId = await API.postUserGameId(lastGameId+1, user.id); // inserting a new game id in db after clicking play
                   // console.log('New Game Id:', newGameId);  
                setGameId(newGameId);
                resetRoundHistory();
                navigate('/game', { state: { gameId: newGameId } });

        }else{

            const lastGameId = await API.getLastGameId(user.id); // getting last game he played from db

              //  console.log('Starting new game with userId:', user.id, 'and gameId:', lastGameId);  
                const newGameId = await API.postUserGameId(lastGameId+1, user.id);
               // console.log('New Game Id:', newGameId);  
                setGameId(newGameId);
                resetRoundHistory();// round history cleared to start a new clean round
                navigate('/game', { state: { gameId: newGameId } });
        }
         
      
                
            } catch (error) {
                console.error('Failed to start a new game:', error);
            }
        }
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-md-center">
                <Col md="auto">
                    <h1>Welcome to MeMe Game</h1>
                    <p className='lead'>Ready to start Guessing !?</p>
                    {!loggedIn ? <p className='lead'>You are not a logged-in user, you have to play a demo</p> : <p className='lead'>You're logged in, you can play the official game</p>}
                </Col>
            </Row>
            <Row className="justify-content-md-center">
                <Col md="auto">
                    {loggedIn ? 
                        <Button variant="secondary" onClick={startNewGame}>Play</Button> :
                        <Button variant="secondary" onClick={anonymous}>Play Anonymous</Button>
                    }
                </Col>
            </Row>
        </Container>
    );
}