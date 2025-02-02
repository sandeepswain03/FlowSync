import apiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import redis from "../utils/redis.js";
import { validationResult } from "express-validator";
import { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Project } from "../models/project.model.js";

const createProject = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        throw new apiError(400, "Validation Error", errors.array());
    }

    const { name } = req.body;

    if (!name) {
        throw new apiError(400, "Project name is required");
    }

    const user = await User.findById(req.user._id);
    if (!user) throw new apiError(400, "User not found");

    let project;
    try {
        project = await Project.create({
            name,
            users: [user._id]
        });
    } catch (error) {
        if (error.code === 11000) {
            throw new apiError(400, "Project already exists");
        }
    }

    return res
        .status(201)
        .json(new apiResponse(201, project, "Project created successfully"));
});

const getProjects = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) throw new apiError(400, "User not found");

    const projects = await Project.find({ users: user._id });
    if (!projects) throw new apiError(400, "No projects found");

    return res.json(
        new apiResponse(200, projects, "Projects fetched successfully")
    );
});

const addUserToProject = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        throw new apiError(400, "Validation Error", errors.array());
    }

    const { users, projectId } = req.body;

    if (!users) {
        throw new Error("users are required");
    }
    if (!isValidObjectId(projectId)) {
        throw new apiError(400, "Project ID is invalid");
    }
    if (!Array.isArray(users) || users.some((user) => !isValidObjectId(user))) {
        throw new Error("Invalid userId(s) in users array");
    }

    const project = await Project.findOne({
        _id: projectId,
        users: req.user._id
    });
    if (!project) throw new Error("Project not found");

    const updateProject = await Project.findByIdAndUpdate(
        {
            _id: projectId
        },
        {
            $addToSet: {
                users: {
                    $each: users
                }
            }
        },
        {
            new: true
        }
    );

    return res.json(
        new apiResponse(200, updateProject, "Project updated successfully")
    );
});

const getProjectById = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    if (!isValidObjectId(projectId)) {
        throw new Error("Project ID is required");
    }

    const project = await Project.findOne({
        _id: projectId
    }).populate("users");

    if (!project) throw new Error("Project not found");

    return res.json(
        new apiResponse(200, project, "Project fetched successfully")
    );
});

export { createProject, getProjects, addUserToProject, getProjectById };
