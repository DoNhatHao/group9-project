const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  console.log('Received GET request to /');
  res.json({ message: 'Test server is working!' });
});

app.get('/users', (req, res) => {
  console.log('Received GET request to /users');
  res.json([
    { id: 1, name: 'Test User 1', email: 'test1@test.com' },
    { id: 2, name: 'Test User 2', email: 'test2@test.com' }
  ]);
});

const PORT = 3001;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Test server running on http://localhost:${PORT}`);
  console.log(`   Press Ctrl+C to stop`);
});

// Keep alive
process.on('SIGINT', () => {
  console.log('\n⏹️  Shutting down server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
