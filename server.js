/*** code for the Express server that uses Mongoose to connect to a MongoDB database and exposes three separate APIs ***/

//Imports the express framework and creates a new Express application object.
const express = require('express');
const app = express();

/*
- imports the cookieParser and mongoose modules. 
- cookieParser is used to parse cookies from incoming HTTP requests.
- mongoose is used to connect to and interact with a MongoDB database.
*/
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

//imports the three router modules for the three APIs that the server will expose.
const userRouter = require('./routes/user');
const todosRouter = require('./routes/todos');
const projectsRouter = require('./routes/projects');

//requires the dotenv module and loads the environment variables from the .env file.
require('dotenv').config({ path: './config/.env' });

/*
configures the Express application to use the cookieParser and express.json middlewares. 
cookieParser is used to parse cookies from incoming HTTP requests 
express.json is used to parse JSON bodies from incoming HTTP requests.
*/
app.use(cookieParser());
app.use(express.json());
//tells the express application to use the three router modules for the three APIs that the server will expose.
app.use('/api/user', userRouter);
app.use('/api/todos', todosRouter);
app.use('/api/projects', projectsRouter);

//connects to the MongoDB database using the MONGO_DB_STRING environment variable.
mongoose.connect(process.env.MONGO_DB_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(() => console.log('MongoDB connected!'));

//starts the Express server on the port specified by the PORT environment variable.
app.listen(process.env.PORT, () => {
    console.log("Server running on port "+process.env.PORT);
});