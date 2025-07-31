import mongoose, { mongo } from "mongoose";
import projectModel from "../models/project.model.js";

export const createProject = async ({
    name,userId
}) => {
    if(!name ){
        throw new Error("Project name is required");
    }
    if(!userId){
        throw new Error("User ID is required");
    }

    let project;
    try {
        project = await projectModel.create({
            name,
            users: [userId]
        });
    } catch (error) {
        if (error.code === 11000 && error.keyPattern && error.keyPattern.name) {
            throw new Error("Project name already exists");
        }
        throw error;
    }
    
    return project;

}

export const getAllProjectByUserId = async ({userId}) => {
    if (!userId) {
        throw new Error("User ID is required");
    }

    const allUserProjects = await projectModel.find({
        users : userId });

    return allUserProjects;
}

export const addUsersToProject = async ({ projectId, users , userId }) => {

    if (!projectId) {
        throw new Error("Project ID is required");
    }

    if(!mongoose.Types.ObjectId.isValid(projectId)){
        throw new Error("Invalid Project ID"); 
    }

    if (!users){
        throw new Error("Users array is required");
    }
    if (!Array.isArray(users) || users.some(userId => !mongoose.Types.ObjectId.isValid(userId))) {
        throw new Error("Users must be a non-empty array");
    }   

    if (!userId) {
        throw new Error("User ID is required");
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid User ID");
    }

    const project = await projectModel.findOne({
        _id: projectId,
        users: userId
    });

    if (!project) {
        throw new Error("User is not part of the project");
    }

    const updatedProject = await projectModel.findOneAndUpdate(
        { _id: projectId},
        {$addToSet: { users: { $each: users } }},
        {new: true}
    )
    return updatedProject;
}