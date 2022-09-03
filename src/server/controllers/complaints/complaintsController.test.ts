import { NextFunction, Request, Response } from "express";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import connectDatabase from "../../../database";
import Complaint from "../../../database/models/Complaint";
import IComplaintRegisterData from "../../../interfaces/IComplaintRegisterData";
import CustomError from "../../../utils/CustomError";
import getAllComplaints from "./complaintsController";

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
