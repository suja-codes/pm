/************************ Express router for managing user authentication and authorization ************************
- /register: handles user registration requests. 
- The userController.registerUser function is called to handle the registration process.

- /login: handles user login requests. 
- passport.authenticate middleware is used to authenticate the user's credentials. 
- valid credentials --> userController.login --> generate and send a JSON Web Token (JWT) to the user.

- /logout: This route handles user logout requests. 
- The passport.authenticate middleware is used to verify the validity of the user's JWT. 
- valid credentials --> userController.logout --> invalidate the JWT and remove it from the user's session.

- /admin: This route handles requests for admin-only resources. 
- passport.authenticate middleware --> verify the validity of the user's JWT and check if the user has the 'admin' role. 
- user is not an admin --> request is denied. 
- user is an admin --> userController.getAdmin function is called to handle the request.

/authenticated: This route handles requests that require an authenticated user. 
- passport.authenticate middleware --> verify the validity of the user's JWT. 
- JWT is valid --> userController.getAuthenticated function is called to handle the request.

*/


const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/user');
const passport = require('passport');
const passportConfig = require('../passport');


userRouter.post('/register', userController.registerUser);
userRouter.post('/login', passport.authenticate('local', { session: false }), userController.login);
userRouter.post('/logout', passport.authenticate('jwt', { session: false }), userController.logout);

userRouter.get('/admin', passport.authenticate('jwt', { session: false }), userController.getAdmin);
userRouter.get('/authenticated', passport.authenticate('jwt', { session: false }), userController.getAuthenticated);


module.exports = userRouter;