import chalk from "chalk";
import Debug from "debug";
import { NextFunction, Request, Response } from "express";
import { User } from "../../../database/models/User";
import ICustomJwtPayload from "../../../interfaces/ICustomJwtPayload";
import {
  IUserLoginData,
  IUserRegisterData,
} from "../../../interfaces/IUserRegisterData";
import { createToken, hashCompare, hashCreator } from "../../../utils/auth";
import CustomError from "../../../utils/CustomError";

const debug = Debug("urbefix:server:usersControllers");

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  debug(chalk.bgMagentaBright("registerUser method requested..."));
  const user: IUserRegisterData = req.body;
  user.password = (await hashCreator(user.password)) as unknown as string;
  try {
    const checkUser = await User.find({
      userEmail: user.userEmail,
    });

    if (checkUser.length > 0) {
      const registerError = CustomError(
        400,
        "This email already exists",
        "This email already exists"
      );

      debug(chalk.bgRedBright(registerError));
      next(registerError);
      return;
    }
    await User.create(user);
    res.status(201).json({ message: "Registered user correctly!" });
  } catch (error) {
    const customError = CustomError(
      error.code,
      error.message,
      "Validation Failed"
    );
    next(customError);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  debug(chalk.bgMagentaBright("loginUser method requested..."));

  const user: IUserLoginData = req.body;

  let findUsers: Array<IUserLoginData>;

  const userError = CustomError(
    403,
    "User or password not valid",
    "Login error"
  );

  try {
    findUsers = await User.find({ userEmail: user.userEmail });

    if (findUsers.length === 0) {
      debug(chalk.bgRedBright("User not registered"));
      next(userError);
      return;
    }
  } catch (error) {
    const finalError = CustomError(
      403,
      "User or password not valid",
      "User not valid"
    );
    debug(chalk.bgRedBright(finalError.message));
    next(finalError);
    return;
  }

  try {
    const isPasswordValid = await hashCompare(
      user.password,
      findUsers[0].password
    );
    if (!isPasswordValid) {
      userError.message = "Password not valid";
      debug(chalk.bgRedBright(userError.message));
      next(userError);
      return;
    }
  } catch (error) {
    const finalError = CustomError(
      403,
      "User or password not valid",
      "Password not found"
    );
    debug(chalk.bgRedBright(finalError.message));
    next(finalError);
    return;
  }

  const payLoad: ICustomJwtPayload = {
    id: findUsers[0].id,
    userEmail: findUsers[0].userEmail,
  };

  const responseData = {
    user: {
      token: createToken(payLoad),
    },
  };
  debug(chalk.bgGreenBright("Login completed!"));
  res.status(200).json(responseData);
};
