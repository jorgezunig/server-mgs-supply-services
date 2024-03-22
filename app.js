import express from "express";
import http from "http";
import { initSocketServer } from "./utils/index.js";
import cors from 'cors';
import morgan from 'morgan';
import {authRoutes, chatMessageRoutes, chatRoutes, userRoutes}  from './routes/index.js';
import  swaggerUI  from "swagger-ui-express";
import  swaggerJsdoc    from "swagger-jsdoc";
import { SWAGGER_SPEC } from "./utils/constants.js";
import { groupController } from "./controllers/group.js";

const app = express();
const server = http.createServer(app);
initSocketServer(server);


// Parse application/json
app.use(express.json());

// Parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(express.static("uploads"));

// Configure Header Http - CORS
app.use(cors());

// Configure logger HTTP request
app.use(morgan("dev"));

//Configure routes

app.use("/api",authRoutes);

app.use("/api",userRoutes);

app.use("/api",chatRoutes);

app.use("/api",chatMessageRoutes);

app.use("/api",groupController);

//Swagger
app.use("/api-doc",swaggerUI.serve,swaggerUI.setup(swaggerJsdoc(SWAGGER_SPEC)));



export { server };
