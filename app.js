import express from "express";
import http from "http";
import { initSocketServer } from "./utils/index.js";
import cors from 'cors';
import morgan from 'morgan';
import {authRoutes, userRoutes}  from './routes/index.js';


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

export { server };
