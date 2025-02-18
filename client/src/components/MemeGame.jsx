import React, { useState, useEffect, useRef } from 'react';
import API from '../API.mjs';
import { useNavigate, useLocation } from 'react-router-dom';
import '../imagecss.css';
import { Container, Row, Col, Button, Modal } from 'react-bootstrap';

const MemeGame = ({ user, roundHistory, setRoundHistory }) => {
  const [meme, setMeme] = useState(null);
  const [captions, setCaptions] = useState([]);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [usedMemes, setUsedMemes] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');

  const memeRef = useRef(null);
  const captionsRef = useRef([]);
  const timerRef = useRef(null);
  const timeoutHandledRef = useRef(false); // Use a ref to track if timeout has been handled
  const navigate = useNavigate();
  const location = useLocation();
  const { gameId: gameObj } = location.state; 
  const gameId = gameObj; 

  // Function to fetch a new meme
  const fetchMeme = async () => {
    let memeData;
    do {
      memeData = await API.getMeme();
    } while (usedMemes.includes(memeData.meme.id));

    setMeme(memeData.meme);
    memeRef.current = memeData.meme; // Store meme in ref

    setCaptions(memeData.captions);
    captionsRef.current = memeData.captions; // Store captions in ref

    setTimeLeft(30);
    timeoutHandledRef.current = false; // Reset the timeoutHandled flag
    setUsedMemes(prevUsedMemes => [...prevUsedMemes, memeData.meme.id]);
    startTimer();
  };

  // Set up timer for countdown
  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          if (!timeoutHandledRef.current) {
            handleCaptionSelect(null); // Handle time-out selection
            timeoutHandledRef.current = true; // Set the timeoutHandled flag
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Function to handle selection of caption
  const handleCaptionSelect = async (captionId) => {
    const currentMeme = memeRef.current;
    const currentCaptions = captionsRef.current;

    if (!currentMeme || currentCaptions.length === 0) {
      //console.log("Reached handleSelection with null meme and captions, we lost them");
      return;
    }

    const isCorrect = captionId ? currentCaptions.find(c => c.id === captionId && c.is_best_match) : false;
    const roundScore = isCorrect ? 5 : 0;
    setScore(prevScore => prevScore + roundScore);

    // Send history to database
    if (captionId === null) {
     // console.log("Reached handleSelection with null captionId " + currentCaptions, currentMeme.id);
      const correctCaptions = currentCaptions.filter(c => c.is_best_match).map(c => c.text).join(' ::: ');
      setMessage(`Time is up! Moving to the next round...correct answers are ${correctCaptions}`);
      await API.sendHistoryToServer(user.id, currentMeme.id, 0, gameId);
    } else {
      //console.log(user.id, currentMeme.id, roundScore, gameId);
      await API.sendHistoryToServer(user.id, currentMeme.id, roundScore, gameId);

      // If correct caption is chosen save in round history
      if (isCorrect) {
        setMessage('Correct! Moving to the next round...');
        const roundData = {
          gameId,
          memeUrl: currentMeme.url,
          caption: currentCaptions.find(c => c.id === captionId).text
        };
        setRoundHistory(prevHistory => [...prevHistory, roundData]);
      } else {
        const correctCaptions = currentCaptions.filter(c => c.is_best_match).map(c => c.text).join(' ::: ');
        setMessage(`Wrong! The correct captions were: ${correctCaptions}`);
      }
    }

    setShowMessage(true);

    // Check if the game should continue or end
    setTimeout(() => {
      setShowMessage(false);
      if (round < 2) {
        setRound(round + 1);
      } else {
        setGameOver(true);
      }
    }, 5000);
  };

  // Effect to fetch a new meme when round changes
  useEffect(() => {
    if (round < 3 && !showMessage && !gameOver) {
      fetchMeme();
    }

    if (gameOver) {
      navigate('/gameOver', {
        state: { score, gameId, user, roundHistory }
      });
    }

    return () => {
      clearInterval(timerRef.current);
    };
  }, [round, gameOver, showMessage]);

  return (
    <Container className="mt-5 game-container">
      {gameOver ? (
        <Row className="justify-content-md-center">
          <Col md="auto">
            <h2>Redirecting to Game Over...</h2>
          </Col>
        </Row>
      ) : (
        <>
          <Modal show={showMessage} backdrop="static" keyboard={false}>
            <Modal.Header>
              <Modal.Title>Round Result</Modal.Title>
            </Modal.Header>
            <Modal.Body>{message}</Modal.Body>
          </Modal>

          <div>
            <div id="time-left">Time left: {timeLeft}</div>
            {meme && (
              <img className="game-image" src={meme.url} alt="meme" />
            )}
          </div>

          <div className="caption-container">
            {captions.map((caption, index) => (
              <Button 
                key={`${caption.id}-${index}`} 
                variant="secondary" 
                onClick={() => handleCaptionSelect(caption.id)}
                disabled={showMessage}
              >
                {index + 1}. {caption.text}
              </Button>
            ))}
          </div>
        </>
      )}
    </Container>
  );
}

export default MemeGame;