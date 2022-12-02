import chalk from "chalk";
import Debug from "debug";
import { NextFunction, Request, Response } from "express";
import Complaint from "../../../database/models/Complaint";
import { User } from "../../../database/models/User";
import IComplaintRegisterData from "../../../interfaces/IComplaintRegisterData";
import ICustomRequest from "../../../interfaces/ICustomRequest";
import CustomError from "../../../utils/CustomError";

const debug = Debug("urbefix:server:complaintsController");

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
  debug(chalk.bgBlueBright("deleteComplaint method requested..."));

  const { id } = req.params;

  try {
    const deleteComplaintItem = await Complaint.findByIdAndDelete(id);

    if (deleteComplaintItem) {
      debug(chalk.bgGreenBright("Complaint deleted correctly!"));
      res.status(200).json({ message: "Complaint deleted correctly!" });
    } else if (!deleteComplaintItem) {
      const complaintNotFoundError = CustomError(
        404,
        "Complaint not found",
        "No complaint with this id"
      );
      debug(chalk.bgRedBright("No complaint with this id"));
      next(complaintNotFoundError);
    }
  } catch (error) {
    const newError = CustomError(
      404,
      "Error while deleting complaint",
      "Error while deleting complaint"
    );
    debug(chalk.bgRedBright("Error while deleting complaint"));
    next(newError);
  }
};

export const getComplaint = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  debug(chalk.bgBlueBright("getComplaint method requested..."));
  try {
    const { id } = req.params;
    const complaint = await Complaint.findById(id);

    debug(chalk.bgGreenBright("Complaint found!"));
    res.status(200).json({ complaint });
  } catch (error) {
    const newError = CustomError(
      400,
      "No complaints found.",
      "No complaints found."
    );
    debug(chalk.bgRedBright("No complaints found."));
    next(newError);
  }
};

export const createComplaint = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  debug(chalk.bgBlueBright("createComplaint method requested..."));
  const complaint = req.body;
  complaint.owner = req.payload.id;
  try {
    const newComplaint = await Complaint.create(complaint);

    const user = await User.findById(newComplaint.owner);
    user.complaints.push(newComplaint.id);
    user.save();

    res.status(201).json({ newComplaint });
    debug(chalk.bgGreenBright("Complaint created correctly!"));
  } catch (error) {
    const newError = CustomError(
      400,
      "Error creating a complaint",
      "Couldn't create the complaint"
    );

    next(newError);
  }
};

export const editComplaint = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  debug(chalk.bgBlueBright("editComplaint method requested..."));
  const { id } = req.params;
  const editComplaint = req.body;
  try {
    let editedComplaint = await Complaint.findByIdAndUpdate(id, editComplaint);
    editedComplaint = await Complaint.findById(id);
    res.status(200).json({ editedComplaint });
  } catch (error) {
    const newError = CustomError(
      400,
      "Couldn't edit complaint.",
      error.message
    );
    next(newError);
  }
};
