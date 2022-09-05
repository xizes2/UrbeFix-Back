import chalk from "chalk";
import Debug from "debug";
import { NextFunction, Request, Response } from "express";
import Complaint from "../../../database/models/Complaint";
import IComplaintRegisterData from "../../../interfaces/IComplaintRegisterData";
import CustomError from "../../../utils/CustomError";

const debug = Debug("urbefix:server:complaintsControllers");

export const getAllComplaints = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  debug(chalk.bgBlueBright("getAllComplaints method requested..."));

  let complaints: Array<IComplaintRegisterData>;

  try {
    complaints = await Complaint.find();
    if (complaints.length === 0) {
      debug(chalk.bgRedBright("No complaints registered"));
      res.status(404).json({ complaints: "No complaints registered" });
      return;
    }
    res.status(200).json({ complaints });
  } catch (error) {
    const finalError = CustomError(
      404,
      "Error trying to get complaints",
      "No complaints registered"
    );

    debug(chalk.bgRedBright("No complaints registered"));
    next(finalError);
  }
};

export const deleteComplaint = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  debug(chalk.bgBlueBright("getAllComplaints method requested..."));

  const { id } = req.params;

  try {
    const deleteComplaintItem = await Complaint.findByIdAndDelete(id);
    if (deleteComplaintItem) {
      debug(chalk.bgGreenBright("Complaint deleted correctly!"));
      res.status(200).json({ message: "Complaint deleted correctly!" });
    }
  } catch (error) {
    const newError = CustomError(
      404,
      "Error while deleting wish",
      "Error while deleting wish"
    );
    debug(chalk.bgRedBright("Error while deleting complaint"));
    next(newError);
  }
};
