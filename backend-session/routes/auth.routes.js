import express from "express";
import { controllers } from "../controllers/auth.controllers.js";

export const authRouter = express.Router();

authRouter.post('/register', controllers.register);
authRouter.post('/login', controllers.login);
authRouter.get('/session', controllers.session);
authRouter.get('/logout', controllers.logout);

export default authRouter;