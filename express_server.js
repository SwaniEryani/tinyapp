const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

function generateRandomString() {
  var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var result = '';
  for ( var i = 0; i <= 6; i++ ) {
      result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
  }
  return result;
}

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  // console.log(req.body);  // Log the POST request body to the console
  // res.send("Ok");         // Respond with 'Ok' (we will replace this)
  urlDatabase[generateRandomString()] = req.body.longURL;
  res.statusCode = 200;
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get('/urls/:shortURL', (req, res) => { 
  let templateVars = {shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]
  };
  
  res.render('urls_show', templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  
  for(const shorturl in urlDatabase){
    if (shorturl === req.params.shortURL){
      const longURL = urlDatabase[req.params.shortURL];
      res.redirect(longURL);
    } else {
      res.statusCode = 404;
      res.render('404');//if a client requests a non-existent shortURL
    }
  }
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("*", (req, res) => {
  res.statusCode = 404;
  res.render('404');

});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});