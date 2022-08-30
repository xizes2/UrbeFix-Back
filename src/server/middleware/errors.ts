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
  error: ICustomError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  let errorCode;
  let errorMessage;

  if (error instanceof ValidationError) {
    errorCode = error.statuscode ?? 400;
    errorMessage = error.publicMessage ?? "Validation Error";
    error.details.body.forEach((errorInfo) => {
      debug(chalk.bgRedBright(errorInfo.message));
    });
  } else {
    errorCode = error.statuscode ?? 500;
    errorMessage =
      error.publicMessage ?? "Something went wrong, please try again";
  }

  res.status(errorCode).json({ error: errorMessage });
};
