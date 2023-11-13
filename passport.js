/************************* code for Node.js Passport authentication configuration *****************************/

/* configures Passport to use two different authentication strategies:
    JwtStrategy: authenticates users using JSON Web Tokens (JWTs).
    LocalStrategy: authenticates users using their username and password.
- configures Passport to use a cookie extractor to extract the JWT from the incoming request. 
- This allows Passport to verify the JWT without requiring the client to send the token in the request body.
*/

//imports the Passport module, the LocalStrategy and JwtStrategy modules, and the User model.
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const User = require('./models/User');

//requires the dotenv module and loads the environment variables from the .env file.
require('dotenv').config({ path: './config/.env' });

//defines a cookie extractor function. 
//extracts the JWT from the incoming request by looking for a cookie named access_token.
const cookieExtractor = req => {
    let token = null
    if(req && req.cookies){
        token = req.cookies["access_token"]
    }
    return token
};

/*
The JwtStrategy expects two options:
jwtFromRequest - tells Passport how to extract the JWT from the incoming request using cookie extractor function.
secretOrKey - secret key that was used to sign the JWT. Passport will use this key to verify the signature of the JWT.
*/
passport.use(new JwtStrategy({
    jwtFromRequest: cookieExtractor,
    secretOrKey: "SherlockHolmes"
},(payload, done) => {
    User.findById({ _id: payload.sub }, (err, user) =>{
        if(err){
            return done(err, false)
        }if(user){
            return done(null, user)
        }else return done(null, false)
    })
}));

// Authenticated Local Strategy using username and password
passport.use(new LocalStrategy((username, password, done) => {
    User.findOne({ username }, (err, user) => {
        if(err){
            return done(err)
        }
        if(!user){
            return done(null, false)
        }
        // check if password is correct
        user.comparePassword(password, done)
    })
}));