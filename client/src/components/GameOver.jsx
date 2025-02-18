import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { Button } from 'react-bootstrap'; 
import { useNavigate } from 'react-router-dom';
import  '../imagecss.css' ;
import API from '../API.mjs';
const GameOver = (props) => {
    const { loggedIn, gameId, setGameId, resetRoundHistory, anonymous } = props;
    const navigate = useNavigate();
    const location = useLocation();
    const { score,  user ,roundHistory } = location.state; //  coming from meme game after i answer a round
 

    const startNewGame = async () => {
        //console.log('Start new game function is called');
        if (loggedIn) {
            try {
              //  console.log('User is logged in');
                //console.log('Starting new game with userId:', user.id, ' and gameId: ', gameId);
                const newGameId = await API.postUserGameId(gameId + 1, user.id);
                //console.log('New Game Id:', newGameId);
                setGameId(newGameId);
                //console.log('Game Id is set:', newGameId);
                resetRoundHistory();
               // console.log('Round history is reset'); 
                navigate('/game', { state: { gameId: newGameId } });
                //console.log('Navigated to /game');
            } catch (error) {
                console.error('Failed to start a new game:', error);
            }
        } else {
            console.log('User is not logged in');
        }
    };

   // console.log(roundHistory);
    //console.log(roundHistory.length);
    return (
        <Container className="mt-5">
            <Row className="justify-content-md-center">
                <Col md="auto">
                    <h1>Game Over</h1>
                    <h2>Final Score: {score}</h2>
                </Col>
            </Row>
            {user && (
                roundHistory.map((round, index) => (
                    <Row key={index}>
                        <Col md={6} className="ml-0">
                            <img className="gameOver-image" src={round.memeUrl} alt="meme" />
                        </Col>
                        <Col md={6} className="border p-3">
                            <p className='game-info'>Game ID: {round.gameId}</p>  
                            <p className='game-info'>Meme:</p>
                            <p className='game-info'>Caption: {round.caption}</p>
                        </Col>
                    </Row>
                ))
            )}
            <Row className="justify-content-md-center">
                <Col md="auto" className="text-center mt-3">
                    {user ? (
 
 
                        <Button variant="primary btn-lg custom-button" onClick={startNewGame}>Play again</Button>
                    ) : (
                        <Button variant="primary btn-lg custom-button" onClick={ anonymous}>Play again</Button>
                    )}
                </Col>
            </Row>
        </Container>
    );
}

export default GameOver;