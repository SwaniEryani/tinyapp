const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require('cookie-parser');
const { generateRandomString, getUserIdbyEmail, createUser ,checkPassword,createNewUrl } = require('./helper');

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "CDVse2" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "CDVse2" },
  b2xVn2: { longURL: "http://www.lighthouselabs.ca", userID: "Gtlov4"}
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
  },
  "62SyXt" :{
    id : "62SyXt",
    email : "dddddd@gggggg.com",
    password: "www"

  }
}



// app.get("/", (req, res) => {
//   res.send("Hello!");
// });

app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    userId: users[req.cookies["id"]],
    cookID: req.cookies["id"]
  };
  res.render("urls_index", templateVars);
});
//______________ start newShortUrl ______________________
app.get("/urls/new", (req, res) => {
  let templateVars = {
    userId: users[req.cookies["id"]],
  };
  
  res.status(200).render("urls_new", templateVars);// added templateVars becouse it crached the adding new featuer 
});

// create new shortURL and add it to the object urlDatabase
app.post("/urls", (req, res) => {//when there is no input -_-
  
  if (req.body.longURL !== '""') {
    if(req.cookies["id"]){
      const url = req.body.longURL;
      const userId =req.cookies["id"]
      createNewUrl(urlDatabase,url, userId);
      res.status(200).redirect("/urls");
    } else {
      res.send("<html><body><h2>Please login before adding new url</h2></body></html>")
    }
    
  }
});
//______________ end newShortUrl ______________________

//______________ start registration ___________________
app.get("/register", (req, res) => {
  let templateVars = {
    userId: users[req.cookies["id"]]
  };
  res.status(200).render("register", templateVars);// added templateVars becouse it crached the adding new featuer 
});

app.post('/register', (req, res) => {
  if (req.body.email && req.body.password) {
    if (!(getUserIdbyEmail(users, req.body.email))) {
      if (req.body.password.length < 6) {
        res.status(400).send('<html><body><h3>Please choose longer password</h3></body></html>')
      } else {
        const id = generateRandomString();
        createUser(users, { id: id, email: req.body.email, password: req.body.password });
        //users[id] = {id: id, email: req.body.email, password: req.body.password} ;
        res.cookie('id', id);
        res.redirect('/urls');
        // console.log("users with the new user >>>>", users);
      }
    } else {
      res.status(400).send('<html><body><h2>This email already exist :)</h2></body></html>')
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

//______________ Start login _________________________
app.get('/login', (req, res) => {
  let templateVars = {
    userId: users[req.cookies["id"]]
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
  res.clearCookie("id");
  res.redirect('/urls');
});

//Update
app.post('/urls/:shortURL/update', (req, res) => {

  if(req.body.longURL.length > 2){
    urlDatabase[req.params.shortURL] ={ longURL: req.body.longURL, userID: req.cookies["id"]}
    res.redirect('/urls');
  } else {
    res.send('<html><body><h2>please choose longer URL</h2></body></html>')
  }
  
});

// Delete 
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

//for checking the users
app.get('/users', (req,res)=>{
  res.json(users);
});
//for checking the users
app.get("/urlsdb", (req, res) => {
  res.json(urlDatabase);
});

app.get('/urls/:shortURL', (req, res) => {
  console.log(req.cookies["id"]);
  if(req.cookies["id"]){
    const temp = { userId: req.cookies["id"]};
    if(urlDatabase[req.params.shortURL]){
      if(req.cookies["id"] === urlDatabase[req.params.shortURL].userID ){
        let templateVars = {
          shortURL: req.params.shortURL,
          longURL: urlDatabase[req.params.shortURL].longURL,
          userId: req.cookies["id"]
        };
        res.render('urls_show', templateVars);
      }else{
        res.send('<html><body><h2>Access forbidden </h2></body></html>');
      }
      
    } else {
      res.status(404).render('404', temp);
      return;
    }
    
  } else {
    res.send('<html><body><h2>you need to register or login </h2></body></html>');
  }
  
});

//redirect to the longURL
app.get("/u/:shortURL", (req, res) => {

  const temp = { userId: req.cookies["id"]};
  if (urlDatabase[req.params.shortURL] === undefined) {// if the shortURL is not there 
  res.status(404).render('404',temp);
  return;
}
let longURL = urlDatabase[req.params.shortURL].longURL;
res.redirect(longURL);


});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// app.get("/", (req, res) => {
// res.redirect("urls_index");
// });

app.get("*", (req, res) => {
  res.statusCode = 404;
  res.render('404');

});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});