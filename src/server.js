const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Create an Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Add CORS configuration
const io = socketIo(server, {
  cors: {
    origin: "http://172.18.0.223:3000",
    methods: ["GET", "POST"],
  }
});

// Predefined set of images
const imageUrls = [
  'https://thumbs.dreamstime.com/b/bunch-bananas-6175887.jpg?w=768',
  'https://thumbs.dreamstime.com/z/full-body-brown-chicken-hen-standing-isolated-white-backgroun-background-use-farm-animals-livestock-theme-49741285.jpg?ct=jpeg',
];

// Helper to get a random image and its type
function getRandomImage() {
  const index = Math.floor(Math.random() * imageUrls.length);
  return {
    url: imageUrls[index],
    type: index === 0 ? 'banana' : 'chicken', // Banana for index 0, Chicken for index 1
  };
}

let gameImages = Array(36).fill().map(getRandomImage);

io.on('connection', (socket) => {
  console.log('New player connected');

  // Send the game images to the players when the game starts
  socket.emit('gameStart', { images: gameImages });

  // Handle player moves
  socket.on('playerMove', (data) => {
    // Broadcast the move to the other player
    const message = data.message; // message could be 'YOU LOSE!' or 'YOU WIN!'
    
    // Here we broadcast it to the opponent.
    socket.broadcast.emit('updateGame', {
      index: data.index,
      message: message,  // opponent gets this message
    });
    
    // Optionally, you can also send the message back to the player who made the move.
    socket.emit('updateGame', {
      index: data.index,
      message: message,  // this message is for the player who made the move
    });
  });

  // Clean up when the player disconnects
  socket.on('disconnect', () => {
    console.log('Player disconnected');
  });
});

// Start the server
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
