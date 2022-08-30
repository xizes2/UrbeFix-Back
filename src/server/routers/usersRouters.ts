import Router from "express";
import { validate } from "express-validation";
import { registerUser } from "../controllers/userController";
import userRegisterDataSchema from "../schemas/userRegisterDataSchema";

const usersRouter = Router();

usersRouter.post(
  "/register",
  validate(userRegisterDataSchema, {}, { abortEarly: false }),
  registerUser
);

export default usersRouter;
