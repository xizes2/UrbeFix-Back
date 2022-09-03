import Router from "express";
import { validate } from "express-validation";
import { loginUser, registerUser } from "../controllers/userController";
import userLoginDataSchema from "../schemas/userLoginDataSchema";
import userRegisterDataSchema from "../schemas/userRegisterDataSchema";

const usersRouter = Router();

usersRouter.post(
  "/register",
  validate(userRegisterDataSchema, {}, { abortEarly: false }),
  registerUser
);
usersRouter.post(
  "/login",
  validate(userLoginDataSchema, {}, { abortEarly: false }),
  loginUser
);

export default usersRouter;
