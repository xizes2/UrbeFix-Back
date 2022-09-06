import { NextFunction, Request, Response } from "express";
import { User } from "../../../database/models/User";
import { loginUser, registerUser } from "./userController";
import CustomError from "../../../utils/CustomError";

let mockHashCompareValue: boolean = true;

jest.mock("../../../utils/auth", () => ({
  ...jest.requireActual("../../../utils/auth"),
  hashCreator: () => jest.fn().mockReturnValue("#"),
  createToken: () => "#",
  hashCompare: () => mockHashCompareValue,
}));

describe("Given a method register of a user controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

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

  const nextTest = jest.fn() as NextFunction;

  User.create = jest.fn().mockReturnValue(mockBodyTest);

  describe("When it's instantiated with a response object", () => {
    test("Then it should call the response method status with 201", async () => {
      User.find = jest.fn().mockReturnValue([]);

      const status = 201;

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

  const loginData = {
    userEmail: "test@Login",
    password: "123456",
  };

  const requestLoginTest: Partial<Request> = { body: loginData };
  const responseLoginTest: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const next = jest.fn() as NextFunction;

  describe("When invoked with a request, response and next params", () => {
    test("Then it should call status function with code 200", async () => {
      User.find = jest.fn().mockReturnValue([loginData]);

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
          "User or password not valid",
          "Login error"
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
          "User or password not valid",
          "User not valid"
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
          "User or password not valid",
          "Password not found"
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
          "User or password not valid",
          "Password not valid"
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
