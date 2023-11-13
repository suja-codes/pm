/******************           Express router for managing projects               *******************

GET /: Retrieves all projects.
GET /:id: Retrieves all todos for the specified project.
POST /createProject: Creates a new project.
- Each route is protected by Passport authentication middleware.
- Only logged-in users can access the route. 
- The middleware uses the jwt strategy.
- The router also uses a controller pattern to organize the code. 
- The projectsController module contains the logic for handling each route.
*/
const express = require('express');
const projectsRouter = express.Router();
const projectsController = require('../controllers/projects');
const passport = require('passport');

projectsRouter.get('/', passport.authenticate('jwt', { session: false }), projectsController.getProjects);
projectsRouter.get('/:id', passport.authenticate('jwt', { session: false }), projectsController.getTodosByProject);
projectsRouter.post('/createProject', passport.authenticate('jwt', { session: false }), projectsController.createProject);

module.exports = projectsRouter;