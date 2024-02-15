const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('static'));

app.get('/', (req, res) => res.sendFile(__dirname + '/static/index.html'));

app.get('/home', (req, res) => res.sendFile(__dirname + '/static/home.html'));

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });