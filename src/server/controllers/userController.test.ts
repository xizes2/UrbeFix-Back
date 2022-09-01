import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../../database/models/User";
import { loginUser, registerUser } from "./userController";
import CustomError from "../../utils/CustomError";

const mockHashCreateValue: boolean | jest.Mock = true;

let mockHashCompareValue = true;

jest.mock("../../utils/auth", () => ({
  ...jest.requireActual("../../utils/auth"),
  createToken: () => jest.fn().mockReturnValue("#"),
  hashCreator: () => mockHashCreateValue,
  hashCompare: () => mockHashCompareValue,
}));

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

describe("Given a method login function of a user controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const fakeUser = {
    userEmail: "test@Login",
    password: "123456",
  };

  const fakeUserLogged = {
    _id: "12345",
    userName: "test@Login",
    password: "123456",
  };

  const requestLoginTest: Partial<Request> = { body: fakeUser };
  const responseLoginTest: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const next: Partial<NextFunction> = jest.fn();

  User.find = jest.fn().mockReturnValue([fakeUserLogged]);

  describe("When invoked with a request, response and next params", () => {
    test("Then it should call status function with code 200", async () => {
      mockHashCompareValue = true;
      await loginUser(
        requestLoginTest as Request,
        responseLoginTest as Response,
        next as NextFunction
      );
      const status = 200;

      expect(responseLoginTest.status).toHaveBeenCalledWith(status);
    });

    test("Then it should call the json method of the response", async () => {
      await loginUser(
        requestLoginTest as Request,
        responseLoginTest as Response,
        next as NextFunction
      );

      expect(responseLoginTest.json).toHaveBeenCalled();
    });

    describe("When there's no users registered", () => {
      test("Then it should call the next function with the created error", async () => {
        User.find = jest.fn().mockReturnValue([]);
        const error = CustomError(
          403,
          "User not found",
          "User or password not valid"
        );

        await loginUser(
          requestLoginTest as Request,
          responseLoginTest as Response,
          next as NextFunction
        );

        expect(next).toHaveBeenCalledWith(error);
      });
    });

    describe("When the user's data don't match", () => {
      test("Then it should call the next function with the error", async () => {
        const error = CustomError(
          403,
          "User invalid",
          "User or password not valid"
        );
        User.find = jest.fn().mockRejectedValue(new Error());

        await loginUser(
          requestLoginTest as Request,
          responseLoginTest as Response,
          next as NextFunction
        );

        expect(next).toHaveBeenCalledWith(error);
      });
    });

    describe("When the user's password is not found", () => {
      test("Then it should call the next function with the created error", async () => {
        User.find = jest.fn().mockReturnValue(false);
        mockHashCompareValue = false;

        const error = CustomError(
          403,
          "Password not found",
          "User or password invalid "
        );

        await loginUser(
          requestLoginTest as Request,
          responseLoginTest as Response,
          next as NextFunction
        );

        expect(next).toHaveBeenCalledWith(error);
      });
    });

    describe("When the the passwords don't match", () => {
      test("Then it should call the next function with the created error ", async () => {
        const notValidPasswordTest = {
          userName: "test@Login",
          password: "498651",
        };

        User.find = jest.fn().mockReturnValue([notValidPasswordTest]);
        mockHashCompareValue = false;

        const userError = CustomError(
          403,
          "Password invalid",
          "User or password not valid"
        );

        await loginUser(
          requestLoginTest as Request,
          responseLoginTest as Response,
          next as NextFunction
        );

        expect(next).toHaveBeenCalledWith(userError);
      });
    });
  });
});
