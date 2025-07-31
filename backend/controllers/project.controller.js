import projectModel from '../models/project.model.js';
import * as projectService from '../services/project.service.js'
import userModel from '../models/user.model.js';
import { validationResult } from 'express-validator';

export const createProject = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name } = req.body;
        const loggedInUserId = await userModel.findOne({ email: req.user.email }).select('_id');
        const userId = loggedInUserId._id;

        const newProject = await projectService.createProject({
            name,
            userId: userId.toString()
        });
        res.status(201).json(newProject)
    } catch (error) {
        console.error(error);
        res.status(400).json(error.message);
    }

}

export const getAllProjects = async (req, res) => {
    try{

        const loggedInUser = await userModel.findOne({
             email: req.user.email
        })

        const allUserProjects = await projectService.getAllProjectByUserId({
            userId: loggedInUser._id
        });

        return res.status(200).json({ projects : allUserProjects});

    }catch (error) {
        console.error(error);
        res.status(400).json(error.message);
    }
}

export const addUsersToProject = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try{
        const {projectId , users} = req.body;

        const loggedInUser = await userModel.findOne({
            email: req.user.email
        });

        const project = await projectService.addUsersToProject({
            projectId,
            users,
            userId: loggedInUser._id.toString()
        })

        return res.status(200).json({
            project: project,
        });

    }catch (error) {
        console.error(error);
        res.status(400).json(error.message);}
}