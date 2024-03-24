const http = require('http');
const { cronJob } = require('./main.js');

const server = http.createServer(async (req, res) => {
  res.end('Server is running...');
  cronJob.start();
});

server.listen(7777, () => {
  console.log('Server is running on port 7777');
});

server.on('error', (error) => {
  console.error(`Error: ${error.message}`);
});