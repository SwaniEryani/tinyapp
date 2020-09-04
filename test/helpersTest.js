const { assert } = require('chai');

const { getUserIdbyEmail,
  generateRandomString,
  createUser,
  searchUser,
  createNewUrl,
  urlsForUser
} = require('../helper.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};
const mockDb = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "CDVse2" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "CDVse2" },
  b2xVn2: { longURL: "http://www.lighthouselabs.ca", userID: "Gtlov4" }
};

describe('getUserIdbyEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserIdbyEmail(testUsers, "user@example.com");
    const expectedOutput = "userRandomID";
    assert.equal(user, expectedOutput);
  });
  it('should return false when there is  no valid email', function() {
    const user = getUserIdbyEmail(testUsers, "user33@example.com");
    const expectedOutput = false;
    assert.equal(user, expectedOutput);
  });
});

describe('getUserIdbyEmail', function() {
  it('should return different strings ', function() {
    const rand1 = generateRandomString();
    const expectedOutput = generateRandomString();
    assert.notEqual(rand1, expectedOutput);
  });
});

describe('createUser', function() {
  it('should create new user ', function() {
    const id = 'user3RandomID';
    const email = 'user3@example.com';
    const password = 'hellothere';
    const newuser = { id, email, password };
    createUser(testUsers, newuser);
    const expectedOutput = {

      "userRandomID": {
        id: "userRandomID",
        email: "user@example.com",
        password: "purple-monkey-dinosaur"
      },
      "user2RandomID": {
        id: "user2RandomID",
        email: "user2@example.com",
        password: "dishwasher-funk"
      },
      "user3RandomID": {
        id: "user3RandomID",
        email: "user3@example.com",
        password: "hellothere"
      }
    };
    assert.deepEqual(testUsers, expectedOutput);
  });
});

describe('searchUser', function() {
  it('should return the a vaild user ', function() {
    const userId = 'user2RandomID';
    const expectedOutput = searchUser(testUsers, userId);
    assert.deepEqual(testUsers[userId], expectedOutput);
  });
  it('should return undefined when ther is no user with the given id ', function() {
    const userId = 'user4RandomID';
    assert.equal(searchUser(testUsers, userId), undefined);
  });
});

describe('createNewUrl', function() {
  it('should ctreate new URL with a given user id ', function() {
    const userId = 'user2RandomID';
    const url = 'hello.com';
    const shortUrl = 'cd432e';
    createNewUrl(shortUrl, mockDb, url, userId);
    const expectedOutput = {
      b6UTxQ: { longURL: "https://www.tsn.ca", userID: "CDVse2" },
      i3BoGr: { longURL: "https://www.google.ca", userID: "CDVse2" },
      b2xVn2: { longURL: "http://www.lighthouselabs.ca", userID: "Gtlov4" },
      cd432e: { longURL: 'hello.com', userID: 'user2RandomID' }
    };

    assert.deepEqual(mockDb, expectedOutput);
  });
});

describe('urlsForUser', function() {
  it('should returen URLs created by one user ', function() {
    const userId = 'CDVse2';
    const tempVal = urlsForUser(mockDb, userId);
    const expectedOutput = {
      b6UTxQ: { longURL: "https://www.tsn.ca", userID: "CDVse2" },
      i3BoGr: { longURL: "https://www.google.ca", userID: "CDVse2" },
    };

    assert.deepEqual(tempVal, expectedOutput);
  });
  it('should emptry object if user didn\'t create any URLs or userId not  Exist  ', function() {
    const userId = 'CdVser';
    const tempVal = urlsForUser(mockDb, userId);
    assert.deepEqual(tempVal, {});
  });
});