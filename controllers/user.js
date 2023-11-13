/******************** Node.js Express controller for user authentication and authorization ********************/

/*
- uses the User model to interact with the database and the JWT library to generate and verify JSON Web Tokens (JWTs).
- The controller has five methods:
    registerUser(): registers a new user.
    login(): logs in a user and generates a JWT.
    logout(): logs out a user and clears the JWT cookie.
    getAdmin(): checks if the user is an admin. 
                If the user is an admin, the method returns a success message. 
                Otherwise, the method returns a forbidden message.
    getAuthenticated(): checks if the user is authenticated. 
                        If the user is authenticated, the method returns the user's username and role. 
                        Otherwise, the method returns an unauthorized message.

*/

const JWT = require('jsonwebtoken');
const User = require('../models/User');

const signToken = userID => {
    return JWT.sign({ 
        iss: "SherlockHolmes",
        sub: userID
    }, "SherlockHolmes", { expiresIn: "1h" })
};

module.exports = {
    registerUser: async (req, res) => {
        const { username, password, role } = req.body
        await User.findOne({ username }, async (err, user) => {
            if(err)
                res.status(500).json({ message: { msgBody: 'Error has occured', msgError: true }})
            if(user)
                res.status(400).json({ message: { msgBody: 'Username is already taken', msgError: true }})
            else{
                const newUser = await new User({ username, password, role })
                newUser.save(err => {
                    if(err)
                        res.status(500).json({ message: { msgBody: 'Error has occured', msgError: true }})
                    else
                        res.status(201).json({ message: { msgBody: 'Account successfully created', msgError: false }})
                })
            }
    
        })
    },
    login: async (req, res) => {
        if(req.isAuthenticated()){
            const { _id, username, role, todos, projects } = req.user
            const token = signToken(_id)
            res.cookie('access_token', token, { httpOnly: true, sameSite: true })
            res.status(200).json({ isAuthenticated: true, user: { username, role, todos, projects }})
        }
    },
    logout: async (req, res) => {
        console.log('controller logout...')
        res.clearCookie('access_token')
        res.json({ user: { username: '', role: '' }, success: true})
    },
    getAdmin: async (req, res) => {
        if(req.user.role === 'admin'){
            res.status(200).json({ message: { msgBody: 'You are an admin', msgError: false }})
        }else res.status(403).json({ message: { msgBody: 'You are not an admin', msgError: true }})
    },
    getAuthenticated: async (req, res) => {
        const { username, role } = req.user
        res.status(200).json({ isAuthenticated: true, user: { username, role }})
    }
};