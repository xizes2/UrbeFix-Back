import chalk from "chalk";
import Debug from "debug";
import { NextFunction, Request, Response } from "express";
import { User } from "../../database/models/User";
import IUserRegisterData from "../../interfaces/IUserRegisterData";
import hashCreator from "../../utils/auth";
import CustomError from "../../utils/CustomError";

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
