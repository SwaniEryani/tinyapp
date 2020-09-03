const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require('cookie-parser');
const { generateRandomString, getUserIdbyEmail, createUser ,checkPassword } = require('./helper');

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  "66wZ5h": "https://web.compass.lighthouselabs.ca/days/today"
};
const users = {
  "CDVse2": {
    id: "CDVse2",
    email: "user@example.com",
    password: "simplePass"
  },
  "Gtlov4": {
    id: "Gtlov4",
    email: "user2@example.com",
    password: "HardPass"
  }
}



// app.get("/", (req, res) => {
//   res.send("Hello!");
// });

app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    userId: users[req.cookies["id"]]
  };
  res.render("urls_index", templateVars);
});
//______________ start newShortUrl ______________________
app.get("/urls/new", (req, res) => {
  let templateVars = {
    userId: req.cookies["email"]
  };
  res.status(200).render("urls_new", templateVars);// added templateVars becouse it crached the adding new featuer 
});

// create new shortURL and add it to the object urlDatabase
app.post("/urls", (req, res) => {//when there is no input -_-
  
  if (req.body.longURL !== '""') {
    
    urlDatabase[generateRandomString()] = req.body.longURL;
    res.status(200).redirect("/urls");
  }
});
//______________ end newShortUrl ______________________

//______________ start registration ___________________
app.get("/register", (req, res) => {
  let templateVars = {
    userId: req.cookies["email"]
  };
  res.status(200).render("register", templateVars);// added templateVars becouse it crached the adding new featuer 
});

app.post('/register', (req, res) => {
  if (req.body.email && req.body.password) {
    if (!(getUserIdbyEmail(users, req.body.email))) {
      console.log("no matched email", req.body.email);
      if (req.body.password.length < 6) {
        res.status(400).send('<html><body><h3>Please choose longer password</h3></body></html>')
      } else {
        const id = generateRandomString();
        createUser(users, { id: id, email: req.body.email, password: req.body.password });
        //users[id] = {id: id, email: req.body.email, password: req.body.password} ;
        res.cookie('id', id);
        res.redirect('/urls');
        console.log("users with the new user >>>>", users);
      }
    } else {
      console.log("matched email >>>>>")
      res.status(400).send('<html><body><h2>This email already exist :)</h2></body></html>')
    }
  } else {
    console.log("no entry email");
    res.status(400).send('<html><body><h2>Please enter your email or the password filed is empty </h2></body></html>');

  } 
  // if (!(req.body.password)) {
  //   console.log("no entry pass")
  //   res.status(400).send('<html><body><h3>Please enter a password or the length is less than 6 characters </h3></body></html>');
  // }
  
});
//______________ End registration ____________________
//______________ Start login _________________________
app.get('/login', (req, res) => {
  let templateVars = {
    userId: req.cookies["email"]
  };
  res.render('login',templateVars);
});

app.post('/login', (req, res) => {
  const userId = getUserIdbyEmail(users,req.body.email);
  console.log(userId);
  if (userId) {
    if (checkPassword(users, userId, req.body.password)){
      res.cookie('id',userId);
      //console.log(req.body.email);
      res.redirect('/urls');
    } else {
      res.status(403).send('<html><body><h2>Password is not correct</h2></body></html>')
    }
   
  } else {
    res.status(403).send('<html><body><h2>This email does not exist</h2></body></html>')
  }
  
});
//___________________End login _______________________
//logout
app.post('/logout', (req, res) => {
  res.clearCookie('email');
  res.redirect('/login');
});

//Update
app.post('/urls/:shortURL/update', (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL
  res.redirect('/urls');
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
    userId: req.cookies["email"]
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
  res.redirect(longURL);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/", (req, res) => {
let templateVars = {
  urls: urlDatabase,
  userId: users[req.cookies["id"]]
};
res.render("urls_index", templateVars);
});

app.get("*", (req, res) => {
  res.statusCode = 404;
  res.render('404');

});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});