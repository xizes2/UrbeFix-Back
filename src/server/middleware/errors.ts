import chalk from "chalk";
import Debug from "debug";
import { NextFunction, Request, Response } from "express";
import { ValidationError } from "express-validation";
import ICustomError from "../../interfaces/ICustomError";

const debug = Debug("urbefix:server:errors");

export const notFoundError = (req: Request, res: Response) => {
  res.status(404).json({ error: "Endpoint not found" });
};

export const generalError = (
  error: ICustomError | ValidationError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  let errorCode;
  if (error instanceof ValidationError) {
    errorCode = error.statusCode ?? 400;
    error.details.body.forEach((errorInfo) => {
      debug(chalk.bgRedBright(errorInfo.message));
    });
  } else {
    errorCode = error.statuscode ?? 500;
  }

  res.status(errorCode).json({ error: error });
};
