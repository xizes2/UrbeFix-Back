import Router from "express";
import { validate } from "express-validation";
import { loginUser, registerUser } from "../../controllers/user/userController";
import userLoginDataSchema from "../../schemas/users/userLoginDataSchema";
import userRegisterDataSchema from "../../schemas/users/userRegisterDataSchema";

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
