import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../API.mjs';
import '../imagecss.css';
import { Modal } from 'react-bootstrap';

const AnonymousGame = () => {
  const [meme, setMeme] = useState(null);
  const [captions, setCaptions] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const timerRef = useRef(null);
  const memeRef = useRef(null);
  const captionsRef = useRef([]);
  const navigate = useNavigate();

  const fetchMeme = async () => {
    try {
      const memeData = await API.getMeme();
      setMeme(memeData.meme);
      setCaptions(memeData.captions);
      memeRef.current = memeData.meme; // Update ref with the latest value
      captionsRef.current = memeData.captions; // Update ref with the latest value
      setTimeLeft(30);
      startTimer();
    } catch (error) {
     // console.error('Error fetching meme:', error);
    }
  };

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          if (memeRef.current && captionsRef.current.length > 0) {
            handleCaptionSelect(null); // Automatically handle time-out selection
          } else {
           // console.log("Data not loaded yet, waiting for data to be loaded...");
            waitForDataToLoadAndHandleSelect(); // Wait and retry
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const waitForDataToLoadAndHandleSelect = () => {
    const checkInterval = setInterval(() => {
      if (memeRef.current && captionsRef.current.length > 0) {
        clearInterval(checkInterval);
        handleCaptionSelect(null);
      }
    }, 500); // Check every 500ms if data is loaded
  };

  const handleCaptionSelect = async (captionId) => {
    if (!memeRef.current || captionsRef.current.length === 0) {
     // console.log("Reached handleSelection with null meme and captions, we lost them");
      return; // Early return to prevent further execution if data is missing
    }

    //console.log("Upon entering handle select: " + memeRef.current.id, captionsRef.current);

    const isCorrect = captionsRef.current.some(caption => caption.id === captionId && caption.is_best_match);
    const roundScore = isCorrect ? 5 : 0;
    setScore(prevScore => prevScore + roundScore);

    if (isCorrect) {
      setModalMessage('You answered correctly!');
    } else {
      const correctCaptions = captionsRef.current.filter(caption => caption.is_best_match).map(caption => caption.text).join(', ');
      setModalMessage(`Wrong! The correct captions are: ${correctCaptions}`);
    }

    setShowModal(true);
    setGameOver(true);
  };

  useEffect(() => {
    fetchMeme();
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (gameOver) {
      setTimeout(() => {
        navigate('/gameOver', { state: { score } });
      }, 3000); // Wait for 3 seconds to show the modal message before navigating
    }
  }, [gameOver, score, navigate]);

  return (
    <div className="game-details">
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Round Result</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
      </Modal>

      {gameOver ? (
        <h2 className="text-center">Game Over</h2>
      ) : (
        <>
          <div id="time-left">Time left: {timeLeft}</div>
          {meme && <img src={meme.url} alt="meme" className="game-image" />}
          <div className="game-info">
            {captions.map((caption) => (
              <button key={caption.id} onClick={() => handleCaptionSelect(caption.id)} className="custom-button">
                {caption.text}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AnonymousGame;