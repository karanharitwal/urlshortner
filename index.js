require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
var urlExists = require('url-exists');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(require('body-parser').urlencoded({ extended: false }))

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});
const shorturl= {};
var count=1;
app.post('/api/shorturl',(req,res)=>{
  urlExists(req.body.url, function(err, exists) {
  if(!exists){
    res.json({
      error: "invalid url"
    });
  }
});
  let exists= Object.values(shorturl).includes(req.body.url);
  if (!exists){
  shorturl[count]=req.body.url;
  res.json({
    original_url : req.body.url,
    short_url : count
  });
  count++
  }
  else{
    const index= Object.values(shorturl).indexOf(req.body.url)
    res.json({
      original_url : req.body.url,
      short_url : index+1
    });

  }
  
 
})
app.get('/api/shorturl/:short_url',(req,res)=>{
  let userurl= req.params.short_url
  if (shorturl[userurl]){
    res.redirect(shorturl[userurl]);
  }
  else{
    res.status(404).send('Not Found');
  }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
