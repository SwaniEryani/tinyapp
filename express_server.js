const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require('cookie-parser')

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  "66wZ5h": "https://web.compass.lighthouselabs.ca/days/today"
};

function generateRandomString() {
  var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var result = '';
  for (var i = 0; i < 6; i++) {
    result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
  }
  return result;
}

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  let templateVars = { 
    urls: urlDatabase, 
    username: req.cookies["username"] 
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let templateVars = { 
    username: req.cookies["username"] 
  };
  res.status(200).render("urls_new",templateVars);// added templateVars becouse it crached the adding new featuer 
});

//login
app.post('/login', (req, res) => {
  let input = JSON.stringify(req.body.username);
  console.log(input.length);
  if (input !== '""') {
    res.cookie('username', input);
    console.log(JSON.stringify(req.body.username));
    res.redirect('/urls');
  } else {
    return;
  }
});

//logout
app.post('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls');
});

//Update
app.post('/urls/:shortURL/update', (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL
  res.redirect('/urls');
});


// create new shortURL and add it to the object urlDatabase
app.post("/urls", (req, res) => {//when there is no input -_-
  if (req.body.longURL !== '""') {
    urlDatabase[generateRandomString()] = req.body.longURL;
    res.status(200).redirect("/urls");
  }
  //res.send(`Short URL for ${req.body.longURL} has been created`);
});

// Delete 
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get('/urls/:shortURL', (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies["username"]
  };
  res.render('urls_show', templateVars);
});

//redirect to the longURL
app.get("/u/:shortURL", (req, res) => {
  if (urlDatabase[req.params.shortURL] === undefined) {// if the shortURL is not there 
    res.status(404).render('404');
    return;
  }
  let longURL = urlDatabase[req.params.shortURL];
  console.log(longURL)
  res.redirect(longURL);
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