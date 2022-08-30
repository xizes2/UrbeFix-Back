import Router from "express";
import { registerUser } from "../controllers/userController";

const usersRouter = Router();

usersRouter.post("/register", registerUser);

export default usersRouter;
