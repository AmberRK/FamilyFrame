const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(express.static(__dirname + '/static'));

app.use(bodyParser.json());

app.get('/', (req, res) => res.sendFile(__dirname + '/static/index.html'));

app.get('/home', (req, res) => res.sendFile(__dirname + '/static/home.html'));

app.get('/login', (req, res) => res.sendFile(__dirname + '/static/login.html'));

app.post('/api/endpoint', (req, res) => {
  const receivedData = req.body;

  if(receivedData.loggedIn) 
  {
    console.log("You are logged in!");

    const dataToSend = 
    {
      message: 'Login validated!'
    };
    
    res.json(dataToSend);
    
  }
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });