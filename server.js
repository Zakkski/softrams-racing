const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
var hsts = require('hsts');
const path = require('path');
var xssFilter = require('x-xss-protection');
var nosniff = require('dont-sniff-mimetype');
const request = require('request');

const app = express();

app.use(cors());
app.use(express.static('assets'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.disable('x-powered-by');
app.use(xssFilter());
app.use(nosniff());
app.set('etag', false);
app.use(
  helmet({
    noCache: true
  })
);
app.use(
  hsts({
    maxAge: 15552000 // 180 days in seconds
  })
);

app.use(
  express.static(path.join(__dirname, 'dist/softrams-racing'), {
    etag: false
  })
);

app.get('/api/members', (req, res) => {
  request('http://localhost:3000/members', (err, response, body) => {
    if (response.statusCode <= 500) {
      res.send(body);
    }
  });
});

app.get('/api/members/:id', (req, res) => {
  request(
    `http://localhost:3000/members/${req.params.id}`,
    (err, response, body) => {
      if (response.statusCode <= 500) {
        res.send(body);
      }
    }
  );
});

app.get('/api/teams', (req, res) => {
  request('http://localhost:3000/teams', (err, response, body) => {
    if (response.statusCode <= 500) {
      res.send(body);
    }
  });
});

// TODO: do you need this?
sendRequest = (url, res) => {
  request(url, (err, response, body) => {
    if (response.statusCode <= 500) {
      res.send(body);
    }
  });
};

app.post('/api/members', (req, res) => {
  request.post(
    'http://localhost:3000/members',
    {
      body: JSON.stringify(req.body),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    },
    (err, response, body) => {
      if (response.statusCode <= 500) {
        res.send();
      }
    }
  );
});

app.patch('/api/members/:id', (req, res) => {
  request.patch(
    `http://localhost:3000/members/${req.params.id}`,
    {
      body: JSON.stringify(req.body),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    },
    (err, response, body) => {
      if (response.statusCode <= 500) {
        res.send();
      }
    }
  );
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/softrams-racing/index.html'));
});

app.listen('8000', () => {
  console.log('Vrrrum Vrrrum! Server starting!');
});
