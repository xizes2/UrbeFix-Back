import chalk from "chalk";
import debug from "debug";
import { NextFunction, Request, Response } from "express";
import { ValidationError } from "express-validation";
import ICustomError from "../../interfaces/ICustomError";

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
  const errorCode = error.code ?? 500;
  let errorMessage =
    error.publicMessage ?? "Something went wrong, please try again";

  if (error instanceof ValidationError) {
    errorMessage = "Validation error";
    debug(chalk.bgRedBright(error.details.body));
  }

  debug(chalk.bgRedBright(`Error code: ${errorCode} => ${errorMessage}`));

  res.status(errorCode).json({ error: errorMessage });
};
