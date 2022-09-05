import { NextFunction, Request, response, Response } from "express";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import connectDatabase from "../../../database";
import Complaint from "../../../database/models/Complaint";
import IComplaintRegisterData from "../../../interfaces/IComplaintRegisterData";
import CustomError from "../../../utils/CustomError";
import { deleteComplaint, getAllComplaints } from "./complaintsController";

describe("Given a method getAllComplaints of a complaints controller", () => {
  const mockComplaintsArray: IComplaintRegisterData = {
    category: "acera",
    title: "acera desnivelada",
    description: "acera está desnivelada por raiz de un árbol",
    countComplaints: 1,
    image: "acera.jpg",
    creationDate: new Date(),
  };

  const reqTest = {} as Partial<Request>;

  const responseTest = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as Partial<Response>;

  const nextTest = jest.fn() as NextFunction;

  describe("When it's instantiated with a response object", () => {
    test("Then it should call the response method status with 200 and an array with the complaint(s)", async () => {
      const status = 200;

      const expectedResponse = {
        complaints: [mockComplaintsArray],
      };

      Complaint.find = jest.fn().mockReturnValue([mockComplaintsArray]);

      await getAllComplaints(
        reqTest as Request,
        responseTest as Response,
        nextTest as NextFunction
      );

      expect(responseTest.status).toHaveBeenCalledWith(status);
      expect(responseTest.json).toHaveBeenCalledWith(expectedResponse);
    });
  });

  describe("When it's instantiated but doesn't respond with valid data", () => {
    test("Then it should call the next function with an error", async () => {
      const expectedError = CustomError(
        404,
        "Error trying to get complaints",
        "No complaints registered"
      );

      Complaint.find = jest.fn().mockRejectedValue(new Error());

      await getAllComplaints(
        reqTest as Request,
        responseTest as Response,
        nextTest as NextFunction
      );

      expect(nextTest).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When called but there are no complaints avaliables", () => {
    test("Then it should respond with 'Error while getting wishes' message", async () => {
      Complaint.find = jest.fn().mockReturnValue([]);

      const expectedError = { complaints: "No complaints registered" };
      const status = 404;

      await getAllComplaints(
        reqTest as Request,
        responseTest as Response,
        nextTest as NextFunction
      );

      expect(responseTest.status).toHaveBeenCalledWith(status);
      expect(responseTest.json).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given a method deleteComplaint of a complaints controller", () => {
  const idPassed = "kfdsjhfds987ds";

  const reqTest = { params: { id: idPassed } } as Partial<Request>;

  const responseTest = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as Partial<Response>;

  const nextTest = jest.fn() as NextFunction;

  describe("When instantitated with a request containing an id", () => {
    test("Then it should delete the complaint with that id", async () => {
      const status = 200;

      const expectedResponse = { message: "Complaint deleted correctly!" };

      Complaint.findByIdAndDelete = jest.fn().mockReturnThis();

      await deleteComplaint(
        reqTest as Request,
        responseTest as Response,
        nextTest as NextFunction
      );

      expect(responseTest.status).toHaveBeenCalledWith(status);
      expect(responseTest.json).toHaveBeenCalledWith(expectedResponse);
    });
  });

  describe("When instantitated with a request containing a non existing id", () => {
    test("Then it should respond with error 404 and an error message", async () => {
      const idError = CustomError(
        404,
        "Complaint not found",
        "No complaint with this id"
      );

      Complaint.findByIdAndDelete = jest.fn().mockReturnValue(null);

      await deleteComplaint(
        reqTest as Request,
        responseTest as Response,
        nextTest as NextFunction
      );

      expect(nextTest).toHaveBeenCalledWith(idError);
    });
  });

  describe("When instantitated with a request containing an error", () => {
    test("Then it should respond with error 404 and an error message", async () => {
      const idError = CustomError(
        404,
        "Error while deleting complaint",
        "Error while deleting complaint"
      );

      Complaint.findByIdAndDelete = jest.fn().mockRejectedValue(idError);

      await deleteComplaint(
        reqTest as Request,
        responseTest as Response,
        nextTest as NextFunction
      );

      expect(nextTest).toHaveBeenCalledWith(idError);
    });
  });
});
