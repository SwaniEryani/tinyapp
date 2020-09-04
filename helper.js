
const getUserIdbyEmail = function(users, requestedEmail) {
  for (const id in users) {
    if (users[id].email === requestedEmail) {
      return id;
    }
  }
  return false;
};
// const getUserById = function(users, requestedID) {
//   for (const id in users) {
//     if (users[id].id === requestedID) {
//       return id;
//     }
//   }
//   return false;
// };

function generateRandomString() {
  const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
  }
  return result;
}
const createUser = (users, { id, email, password }) => {

  users[id] = {
    id,
    email,
    password
  };
};

// const checkPassword = function(users, userId, passowrd) {
//   if(users[userId]){
//     return users[userId].password === passowrd;
//   }
//   return false;
// }

const searchUser = function(users, userId) {
  return users[userId];
};
function createNewUrl(shortUrl, db, url, userId) {
  db[shortUrl] = {
    longURL: url,
    userID: userId
  };
}

const urlsForUser = function(urlDatabase, id) {
  let urlUser = {};
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      urlUser[shortURL] = urlDatabase[shortURL];//
    }
  }

  return urlUser;
};
module.exports = {
  generateRandomString,
  getUserIdbyEmail,
  createUser,
  searchUser,
  createNewUrl,
  urlsForUser
};