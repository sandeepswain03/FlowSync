import { Router } from "express";
import { body } from "express-validator";
import {
    createProject,
    getProjects,
    addUserToProject,
    getProjectById
} from "../controllers/project.controller.js";
import checkAuth from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
    "/create",
    body("name").isLength({ min: 1 }).withMessage("Project name is required"),
    checkAuth,
    createProject
);

router.get("/get-projects", checkAuth, getProjects);

router.put(
    "/add-user",
    body("projectId").isString().withMessage("Project ID is required"),
    body("users")
        .isArray({ min: 1 })
        .withMessage("Users must be an array of strings")
        .bail()
        .custom((users) => users.every((user) => typeof user === "string"))
        .withMessage("Each user must be a string"),
    checkAuth,
    addUserToProject
);

router.get("/get-project/:projectId", checkAuth, getProjectById);

export default router;
