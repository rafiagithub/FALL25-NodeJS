// Import the HTTP module
const http = require('http');

// Define the hostname and port
const hostname = '127.0.0.1';
const port = 3000;

// Create an HTTP server
const server = http.createServer((req, res) => {
  // Log request information
  console.log(`Received ${req.method} request for: ${req.url}`);
  
  // Get request headers
  const headers = req.headers;
  console.log('Request headers:', headers);
  
  // Handle different routes
  if (req.url === '/') {
    // Set response headers
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    
    // Send response body
    res.end(`
      <html>
        <head>
          <title>Node.js HTTP Server</title>
        </head>
        <body>
          <h1>Welcome to our Node.js HTTP Server!</h1>
          <p>This is the homepage.</p>
          <ul>
            <li><a href="/about">About page</a></li>
            <li><a href="/api/data">API endpoint</a></li>
            <li><a href="/nonexistent">404 example</a></li>
          </ul>
        </body>
      </html>
    `);
  } 
  else if (req.url === '/about') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end('<h1>About Page</h1><p>This is a simple HTTP server built with Node.js</p>');
  } 
  else if (req.url === '/api/data') {
    // JSON response example
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    const data = {
      message: 'This is JSON data',
      timestamp: new Date().toISOString(),
      endpoints: ['/about', '/', '/api/data']
    };
    res.end(JSON.stringify(data));
  } 
  else {
    // Handle 404 Not Found
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/html');
    res.end('<h1>404 Not Found</h1><p>The page you requested does not exist.</p>');
  }
});

// Start the server
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});