
const getUserIdbyEmail = function (users, requestedEmail) {
  for (const id in users) {
    if (users[id].email === requestedEmail) {
      return id;
    }
  }
  return false;
};
const getUserById = function (users, requestedID) {
  for (const id in users) {
    if (users[id].id === requestedID) {
      return id;
    }
  }
  return false;
};

function generateRandomString() {
  var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var result = '';
  for (var i = 0; i < 6; i++) {
    result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
  }
  return result;
}
const createUser = (users,{id, email, password}) => {

  users[id] = {
    id,
    email,
    password
  };
}

const checkPassword = function (users, userId, passowrd) {
  if(users[userId]){
    return users[userId].password === passowrd;
  }
  return false;
}
const genrateSessionKeys = function (){
  let tempKeys = [];
  for(const key in users){
    tempKeys.push(key);
  }
  return tempKeys;
}
module.exports = {
  generateRandomString,
  getUserIdbyEmail,
  createUser,
  genrateSessionKeys,
  getUserById,
  checkPassword
};