import express from "express";
import { userController } from "../controllers/user.js";
import { mdAuth } from "../middlewares/index.js";
import multipart from "connect-multiparty";

const mdUpload = multipart({uploadDir:"./uploads/avatar"});

const api = express.Router();

api.get("/user/me",[mdAuth.asureAuth],userController.getMe);
api.patch("/user/me",[mdAuth.asureAuth,mdUpload],userController.updateUser);
api.get("/users",[mdAuth.asureAuth],userController.getUsers);
api.get("/user/:id",[mdAuth.asureAuth],userController.getUserById);


export const userRoutes = api;