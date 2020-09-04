# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

!["/ulrs page"](https://github.com/SwaniEryani/tinyapp/blob/master/Docs/Screen%20Shot%202020-09-04%20at%201.59.02%20AM.png)
!["/reigister page"](https://github.com/SwaniEryani/tinyapp/blob/master/Docs/Screen%20Shot%202020-09-04%20at%201.59.26%20AM.png)

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.

## How to use

- Root page will redirect you to the login page.
- Login page has a post form which will check the user email and password, by clicking the login button the server will check the email and the encrypted password in the Database then direct the user to /urls page.
!["/login page"](https://github.com/SwaniEryani/tinyapp/blob/master/Docs/Screen%20Shot%202020-09-04%20at%201.59.45%20AM.png)
- In /urls page will display the urls for the logged in user.
!["can veiw all  created URLs"](https://github.com/SwaniEryani/tinyapp/blob/master/Docs/Screen%20Shot%202020-09-04%20at%202.59.22%20AM.png)
- The user will be happy to see her/his ShortUrls and will be able to edit with the same ShortUrl just the long link can be change and keep the precious ShortUrl and can delete or add more urls by navigate to the navigation bar to new URLS which will allow to add new Urls.
- Adding new URL is easy as pie just fill in the text box "input" the click add button. the new ShortUrl will be save in the database.
!["Adding new URL"](https://github.com/SwaniEryani/tinyapp/blob/master/Docs/Screen%20Shot%202020-09-04%20at%202.00.49%20AM.png)
- After adding the user will be shown the new URL and can change it.
!["Veiw the new URL"](https://github.com/SwaniEryani/tinyapp/blob/master/Docs/Screen%20Shot%202020-09-04%20at%202.01.38%20AM.png)
- The user can't see other users URLs.
- Logout clears the encrypted cookies.


## How to achive the security
- all the cookies are encrypted.
- all users’ password saved after they Hashed.

Hope you injoy you ShortUrl :P 
