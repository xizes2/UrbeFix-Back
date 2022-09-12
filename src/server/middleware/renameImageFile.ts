import chalk from "chalk";
import Debug from "debug";
import { NextFunction, Request, Response } from "express";
import fs from "fs/promises";
import path from "path";
import CustomError from "../../utils/CustomError";

const debug = Debug("urbefix:server:renameImageFile");

const renameImageFile = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  debug(chalk.bgYellowBright("renameImageFile middleware requested..."));
  try {
    const { newComplaint } = req.body;

    const complaint = await JSON.parse(newComplaint);
    const newName = `${Date.now()}${req.file.originalname}`;
    complaint.image = newName;

    await fs.rename(
      path.join("uploads", req.file.filename),
      path.join("uploads", newName)
    );

    req.body = complaint;

    next();
  } catch (error) {
    debug(chalk.bgRedBright(error));

    const errorData = CustomError(404, "Missing data", "Missing data");
    next(errorData);
  }
};

export default renameImageFile;
