const http = require('http');
const { checkPageChanges } = require('./https.js');

const server = http.createServer(async (req, res) => {
  if (req.url === '/check') {
    const changes = await checkPageChanges();
    res.end(changes);
  } else {
    res.end('Server is running...');
  }
});

server.listen(7777, () => {
  console.log('Server is running on port 7777');
});

server.on('error', (error) => {
  console.error(`Error: ${error.message}`);
});