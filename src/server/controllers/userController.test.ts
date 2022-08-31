import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../../database/models/User";
import { registerUser } from "./userController";
import CustomError from "../../utils/CustomError";

describe("Given a method register of a user controller", () => {
  const mockBodyTest = {
    firsName: "Jah",
    firstSurname: "Rastafaray",
    profileImage: "jah.jpg",
    userEmail: "jah@gmail.com",
    password: "987654",
  };

  const reqTest = {
    body: {
      user: mockBodyTest,
    },
  } as Partial<Request>;

  const responseTest = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as Partial<Response>;

  const nextTest = jest.fn();

  const bcryptTest = jest.fn().mockResolvedValue("test");

  (bcrypt.hash as jest.Mock) = bcryptTest;

  describe("When it's instantiated with a response object", () => {
    test("Then it should call the response method status with 201", async () => {
      const status = 201;

      User.create = jest.fn();

      await registerUser(
        reqTest as Request,
        responseTest as Response,
        nextTest as NextFunction
      );
      expect(responseTest.status).toHaveBeenCalledWith(status);
    });

    test("Then it should call the response method json with a message", async () => {
      const mockMessage = { message: "Registered user correctly!" };

      User.create = jest.fn().mockResolvedValue(reqTest);

      await registerUser(
        reqTest as Request,
        responseTest as Response,
        nextTest as NextFunction
      );

      expect(responseTest.json).toHaveBeenCalledWith(mockMessage);
    });
  });

  describe("When it receives a response with the incorrect properties", () => {
    test("Then it should throw an error", async () => {
      const customErrorTest = CustomError(
        400,
        "General Error",
        "Validation Failed"
      );

      User.create = jest.fn().mockRejectedValue(customErrorTest);

      await registerUser(
        reqTest as Request,
        responseTest as Response,
        nextTest as NextFunction
      );
      expect(nextTest).toHaveBeenCalledWith(customErrorTest);
    });
  });
});
