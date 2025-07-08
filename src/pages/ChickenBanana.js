import React, { useState, useEffect } from 'react';
import './ChickenBanana.css';
import io from 'socket.io-client';

// Connect to server
const socket = io('http://172.18.0.223:3001');

function ChickenBanana() {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [images, setImages] = useState([]);
  const [pressed, setPressed] = useState(Array(36).fill(false));
  const [dialogMessage, setDialogMessage] = useState(null);
  const [gameOver, setGameOver] = useState(false);  // Track if the game is over

  // Listen for the other player's move
  useEffect(() => {
    // Load images
    socket.on('gameStart', (data) => {
      setImages(data.images);
    });

    socket.on('updateGame', (data) => {
      setPressed((prev) => {
        const newPressed = [...prev];
        newPressed[data.index] = true;
        return newPressed;
      });
      setDialogMessage(data.message);  // Show the message from the other player
    });

    return () => {
      socket.off('updateGame');  // Clean up on component unmount
    };
  }, []);

  const handleClick = (index) => {
    // If this square has been pressed or the game is over, return early
    if (pressed[index] || gameOver) return;

    const image = images[index];

    // Check if player has selected a side
    if (!playerChoice) {
      setDialogMessage('Please select a side first!');
      return;
    }

    const isLoss = image.type !== playerChoice;

    // Update pressed state to disable the square
    setPressed((prev) => {
      const newPressed = [...prev];
      newPressed[index] = true;
      return newPressed;
    });

    // Send the player's move to the other player
    const message = isLoss ? 'YOU LOSE!' : ''; // No message when the move is correct
    socket.emit('playerMove', {
      index,
      message,
      playerChoice,  // send the player's side for clarity
    });

    // Update the dialog message
    if (isLoss) {
      setDialogMessage('YOU LOSE!');
      setGameOver(true);  // End the game if the player loses
    } else {
      setDialogMessage(null); // No dialog for correct move, continue game
    }
  };

  const restartGame = () => {
    // Reset the game state
    setPlayerChoice(null);
    setPressed(Array(36).fill(false));
    setDialogMessage(null);
    setGameOver(false);  // Reset game over state
  };

  return (
    <div className="container">
      <h1>Chicken Banana Game!</h1>

      <div className="chooseSide">
        <div className='sideButtonContainer'>
          <button className='sideButton' onClick={() => setPlayerChoice('chicken')}>Chicken</button>
          <button className='sideButton' onClick={() => setPlayerChoice('banana')}>Banana</button>
        </div>
        
        <p>Side: {playerChoice ? playerChoice.toUpperCase() : 'NONE SELECTED'}</p>
      </div>

      <div className="grid">
        {images.map((imgObj, index) => (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(index)}
            className="square"
          >
            {pressed[index] ? (
              <img
                src={imgObj.url}
                alt={`img-${index}`}
                className="img"
              />
            ) : (
              index + 1
            )}
          </button>
        ))}
      </div>

      {dialogMessage && (
        <DialogBox
          message={dialogMessage}
          onClose={restartGame}
        />
      )}
    </div>
  );
}

// Updated DialogBox component (capitalized)
function DialogBox({ message, onClose }) {
  return (
    <div className="dialog-box-overlay">
      <div className="dialog-box">
        <p>{message}</p>
        <button onClick={onClose}>OK</button>
      </div>
    </div>
  );
}

export default ChickenBanana;
