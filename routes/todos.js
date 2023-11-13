/* *********************** Express router for managing todos   ******************************

GET /: Retrieves all todos.
POST /addTodo: Creates a new todo.
PUT /toggleComplete: Updates the completion status of a todo.
DELETE /removeTodo: Deletes a todo.
- Each route is protected by Passport authentication middleware using the jwt strategy. 
- Only logged-in users can access the routes. 
- The router also utilizes a controller pattern to organize the code.
- todosController module handles the logic for each route.
*/

const express = require('express');
const todosRouter = express.Router();
const todosController = require('../controllers/todos');
const passport = require('passport');

todosRouter.get('/', passport.authenticate('jwt', { session: false }), todosController.getTodos);
todosRouter.post('/addTodo', passport.authenticate('jwt', { session: false }), todosController.addTodo);
todosRouter.put('/toggleComplete', passport.authenticate('jwt', { session: false }), todosController.toggleComplete);
todosRouter.delete('/removeTodo', passport.authenticate('jwt', { session: false }), todosController.removeTodo);


module.exports = todosRouter;