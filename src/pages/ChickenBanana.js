import React, { useState } from 'react';
import './ChickenBanana.css';

const imageUrls = [
  'https://thumbs.dreamstime.com/b/bunch-bananas-6175887.jpg?w=768',  // banana at index 0
  'https://thumbs.dreamstime.com/z/full-body-brown-chicken-hen-standing-isolated-white-backgroun-background-use-farm-animals-livestock-theme-49741285.jpg?ct=jpeg', // chicken at index 1
];

// Helper to get a random image and its type
function getRandomImage() {
  const index = Math.floor(Math.random() * imageUrls.length);
  return {
    url: imageUrls[index],
    type: index === 0 ? 'banana' : 'chicken',
  };
}

function ChickenBanana() {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [images] = useState(Array(36).fill().map(getRandomImage));
  const [pressed, setPressed] = useState(Array(36).fill(false));

  const handleClick = (index) => {
    if (pressed[index]) return; // already pressed, ignore

    const image = images[index];
    if (!playerChoice) {
      alert('Please select a side first!');
      return;
    }

    setPressed((prev) => {
      const newPressed = [...prev];
      newPressed[index] = true;
      return newPressed;
    });

    if (image.type !== playerChoice) {
      alert('YOU LOSE!')
    }
  };

  return (
    <div className="container">
      <h1>Chicken Banana Game!</h1>

      <div className="chooseSide">
        <button className='sideButton' onClick={() => setPlayerChoice('chicken')}>Chicken</button>
        <button className='sideButton' onClick={() => setPlayerChoice('banana')}>Banana</button>
        <p>Side: {playerChoice || 'None selected'}</p>
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
    </div>
  );
}

export default ChickenBanana;
