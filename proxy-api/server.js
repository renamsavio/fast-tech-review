/*Created by Renam Savio @renamsavio on 16/03/2018
  - NodeJS program that creates a proxy API

  Usage: node server.js
*/

var express = require('express');
var request = require('request');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8000;

var router = express.Router();

const MAX_REQUESTS_PER_PAGE = 10;
const PAGE = 1;
const BEER_API_URL = 'https://api.punkapi.com/v2/beers';

function getAllBeers(res, query) {
  query.page = query.page || PAGE;
  query.per_page = query.per_page || MAX_REQUESTS_PER_PAGE;
  
  request({
    uri: BEER_API_URL,
    qs: query
  })
  .on('error', function(err) {
    res.status(500).json({message: 'There was an error in the API requested.'});
  })
  .pipe(res);
}

function getBeerById(res, id) {
  request({
    uri: BEER_API_URL + '/' + id
  }).pipe(res);
}

//middleware
router.use(function (req, res, next) {
  console.log('this is a  middleware ...all requests can be intercepted here before being reached.');
  next();
});

//routes
router.get('/', function (req, res) {
  res.json({ message: 'hooray! welcome to our api!' });
});

router.route('/beers')
  .get(function (req, res, next) {
    getAllBeers(res, req.query);
});

router.route('/beer/:beer_id')
  .get(function (req, res) {
    if(!isNaN(req.params.beer_id))
      getBeerById(res, req.params.beer_id);
    else
      res.status(500).json({message: 'It is not a number'});
  });

app.use('/api', router);

app.listen(port);
console.log('Server running on port ' + port);
