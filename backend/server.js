const express = require('express');
const app = express();
const port = 8080; // 後端服務運行在 Port 3001

app.get('/api/status', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running on Node.js!' });
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
