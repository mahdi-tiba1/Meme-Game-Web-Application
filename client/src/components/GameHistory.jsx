import React, { useEffect, useState } from 'react';
import API from '../API.mjs';
import '../imagecss.css';
import { Container, Row, Col, Card } from 'react-bootstrap';

const GameHistory = (props) => {
  const [history, setHistory] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [totalScorePerGame, setTotalScorePerGame] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const historyy = await API.getUserMemeHistory(props.user.id);
        //console.log('Setting game history:', history);
        setHistory(historyy);

        const totalScoreForAllGames = await API.getSumScore();
        setTotalScore(totalScoreForAllGames);
        //console.log(totalScore);

        const sumPerGame = await API.getTotalScoreForGame();
        setTotalScorePerGame(sumPerGame);
      } catch (error) {
        console.error('Error fetching game history:', error);
      }
    };
    fetchHistory();
  }, [props.user.id]);

  function chunkArray(array, size) {
    var result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md="auto">
          <h1>Total Score: {totalScore}</h1>
        </Col>
      </Row>
      {chunkArray(history, 3).map((chunk, chunkIndex) => (
        <React.Fragment key={`chunk-${chunkIndex}`}>
          <Row>
            {chunk.map((item) => (
              <Col sm={4} key={item.history_id}>
                <Card className="mb-4">
                  <Card.Img className="game-image" variant="top" src={item.meme_url} alt="Meme" />
                  <Card.Body>
                    <Card.Text>Score: {item.score}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          {totalScorePerGame[chunkIndex] && (
            <Row className="justify-content-md-center">
              <Col md="auto">
                <h2>Total Score for Game {totalScorePerGame[chunkIndex].gameId}: {totalScorePerGame[chunkIndex].totalScore}</h2>
              </Col>
            </Row>
          )}
        </React.Fragment>
      ))}
    </Container>
  );
}

export default GameHistory;