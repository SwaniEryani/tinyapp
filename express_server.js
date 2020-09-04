const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 8080; // default port 8080
//const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const { generateRandomString, getUserIdbyEmail, createUser, createNewUrl, searchUser, urlsForUser } = require('./helper');
const bcrypt = require('bcrypt');

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(cookieParser());
app.set('trust proxy', 1);
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));


const urlDatabase = {
  b6UTxQ: { longURL: "https://www.github.com", userID: "CDVse2" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "CDVse2" },
  b2xVn2: { longURL: "http://www.lighthouselabs.ca", userID: "Gtlov4" }
};
const users = {
  "CDVse2": {
    id: "CDVse2",
    email: "user@example.com",
    password: bcrypt.hashSync("simplePass", 10)
  },
  "Gtlov4": {
    id: "Gtlov4",
    email: "user2@example.com",
    password: bcrypt.hashSync("HardPass", 10)
  },
  "62SyXt": {
    id: "62SyXt",
    email: "aleryanisilwan@gmail.com",
    password: bcrypt.hashSync("www", 10)

  }
};
//________________GET /___________
app.get("/", (req, res) => {
  
  if (req.session.user_id) {
    const userId = req.session.user_id;
    const user = searchUser(users, userId);
    let templateVars = { user };
    res.redirect("urls_index", templateVars);
  } else {
    res.redirect('login');
  }
  
});

//________________GET /urls___________

app.get("/urls", (req, res) => {

  const userId = req.session.user_id;
  const user = searchUser(users, userId);
  const urls = urlsForUser(urlDatabase, userId);
  console.log(urls);

  let templateVars = { urls, user };
  res.render("urls_index", templateVars);
});

//________________GET /urls/new _________________________
//______________ start newShortUrl ______________________
app.get("/urls/new", (req, res) => {
  const userId = req.session.user_id;
  const user = searchUser(users, userId);
  let templateVars = { user };

  res.status(200).render("urls_new", templateVars);// added templateVars becouse it crached the adding new featuer
});

//____________________POST /urls _________________________
// create new shortURL and add it to the object urlDatabase
app.post("/urls", (req, res) => {//when there is no input -_-

  if (req.body.longURL) {
    if (req.session.user_id) {
      const url = req.body.longURL;
      const userId = req.session.user_id;
      const shortUrl = generateRandomString();
      createNewUrl(shortUrl, urlDatabase, url, userId);
      res.status(200).redirect(`/urls/${shortUrl}`);
    } else {
      res.send("<html><body><h2>Please login before adding new url</h2></body></html>");
    }
  } else {
    res.redirect('/urls/new');
  }
});
//______________ end newShortUrl ______________________
//________________GET /register _______________________
//______________ start registration ___________________
app.get("/register", (req, res) => {
  const userId = req.session.user_id;
  const user = searchUser(users, userId);
  let templateVars = { user };
  res.status(200).render("register", templateVars);// added templateVars becouse it crached the adding new featuer
});
//__________________POST /register______________________
app.post('/register', (req, res) => {
  if (req.body.email && req.body.password) {
    if (!(getUserIdbyEmail(users, req.body.email))) {
      if (req.body.password.length < 6) {
        res.status(400).send('<html><body><h3>Please choose longer password</h3></body></html>');
      } else {
        const id = generateRandomString();
        createUser(users, {
          id: id,
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, 10)
        });
        const userId = getUserIdbyEmail(users, req.body.email);
        const user = searchUser(users, userId);
        req.session['user_id'] = user.id;
        res.redirect('/urls');
        // console.log("users with the new user >>>>", users);
      }
    } else {
      res.status(400).send('<html><body><h2>This email already exist :)</h2></body></html>');
    }
  } else {
    res.status(400).send('<html><body><h2>Please enter your email or the password filed is empty </h2></body></html>');

  }
  // if (!(req.body.password)) {
  //   console.log("no entry pass")
  //   res.status(400).send('<html><body><h3>Please enter a password or the length is less than 6 characters </h3></body></html>');
  // }

});
//______________ End registration ____________________
//______________ GET /login___________________________
//______________ Start login _________________________
app.get('/login', (req, res) => {
  const userId = req.session.user_id;
  const user = searchUser(users, userId);
  let templateVars = { user };
  res.render('login', templateVars);
});
//_______________ POST /login _________________________
app.post('/login', (req, res) => {

  const userId = getUserIdbyEmail(users, req.body.email);
  const user = searchUser(users, userId);
  console.log(userId);
  if (userId) {
    if (bcrypt.compareSync(req.body.password, users[userId].password)) {
      req.session['user_id'] = user.id;
      //console.log(req.body.email);
      res.redirect('/urls');
    } else {
      res.status(403).send('<html><body><h2>Password is not correct</h2></body></html>');
    }

  } else {
    res.status(403).send('<html><body><h2>This email does not exist</h2></body></html>');
  }

});
//___________________End login _______________________
//logout
//___________________POST /logout ____________________
app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/login');
});

//Update
//__________________POST /urls/:id ____________________
app.post('/urls/:shortURL/update', (req, res) => {

  if (req.body.longURL.length > 2) {
    urlDatabase[req.params.shortURL] = { longURL: req.body.longURL, userID: req.session.user_id };
    res.redirect('/urls');
  } else {
    res.send('<html><body><h2>please choose longer URL</h2></body></html>');
  }

});
//____________POST /urls/:id/delete__________
// Delete
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

//_______________GET /urls/:id_________________
app.get('/urls/:shortURL', (req, res) => {

  if (req.session.user_id) {
    const userId = req.session.user_id;
  const user = searchUser(users, userId);
  let templateVars = { user };
    if (urlDatabase[req.params.shortURL]) {
      if (req.session.user_id === urlDatabase[req.params.shortURL].userID) {
        const userId = req.session.user_id;
        const user = searchUser(users, userId);
        let templateVars = {
          user,
          shortURL: req.params.shortURL,
          longURL: urlDatabase[req.params.shortURL].longURL,
          userId: req.session.user_id
        };
        res.render('urls_show', templateVars);
      } else {
        res.send('<html><body><h2>Access forbidden </h2></body></html>');
      }

    } else {
      res.status(404).render('404', templateVars);
      return;
    }

  } else {
    res.send('<html><body><h2>you need to register or login </h2></body></html>');
  }

});
//_________________________GET /u/:id_______________________
//redirect to the longURL
app.get("/u/:shortURL", (req, res) => {

  const userId = req.session.user_id;
  const user = searchUser(users, userId);
  let templateVars = { user };
  if (urlDatabase[req.params.shortURL] === undefined) {// if the shortURL is not there
    res.status(404).render('404', templateVars);
    return;
  }
  let longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);


});

// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });


app.get("*", (req, res) => {
  const userId = req.session.user_id;
  const user = searchUser(users, userId);
  let templateVars = { user };
  res.statusCode = 404;
  res.render('404', templateVars);

});

// //for checking the users
// app.get('/users', (req, res) => {
//   res.json(users);
// });
// //for checking the users
// app.get("/urlsdb", (req, res) => {
//   res.json(urlDatabase);
// });
// //cehck the sisstion
// app.get("/session", (req, res) => {
//   res.json(req.session);
// });
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});