import { NextFunction, Request, response, Response } from "express";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import connectDatabase from "../../../database";
import Complaint from "../../../database/models/Complaint";
import IComplaintRegisterData from "../../../interfaces/IComplaintRegisterData";
import CustomError from "../../../utils/CustomError";
import {
  createComplaint,
  deleteComplaint,
  getAllComplaints,
  getComplaint,
} from "./complaintsController";

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

describe("Given a method getComplaint of a complaints controller", () => {
  const mockComplaint = {
    category: "Contenedores de Resíduos",
    countComplaints: "1",
    creationDate: "2022-09-06T11:13:00.000Z",
    description: "contenedor lleno",
    image:
      "https://thumbs.dreamstime.com/z/contenedor-lleno-dos-y-muchos-bolsos-de-basura-en-la-calle-ciudad-monta%C3%B1a-146937943.jpg",
    title: "Contenedor lleno",
    id: "6318d3f81cd4447cf4787098",
  };

  const reqTest = {
    params: { id: mockComplaint.id },
  } as Partial<Request>;

  const responseTest = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as Partial<Response>;

  const nextTest = jest.fn() as NextFunction;

  describe("When instantitated with a request containing an id", () => {
    test("Then it should show the complaint with that id", async () => {
      const status = 200;

      const expectedResponse = { complaint: mockComplaint };

      Complaint.findById = jest.fn().mockReturnValue(mockComplaint);

      await getComplaint(
        reqTest as Request,
        responseTest as Response,

        nextTest as NextFunction
      );

      expect(responseTest.status).toHaveBeenCalledWith(status);
      expect(responseTest.json).toHaveBeenCalledWith(expectedResponse);
    });
  });

  describe("When instantitated with a request containing an invalid id", () => {
    test("Then it should next an not found error", async () => {
      const idError = CustomError(
        400,
        "No complaints found.",
        "No complaints found."
      );

      const expectedResponse = idError;

      Complaint.findById = jest.fn().mockRejectedValue(idError);

      await getComplaint(
        reqTest as Request,
        responseTest as Response,
        nextTest as NextFunction
      );

      expect(nextTest).toHaveBeenCalledWith(expectedResponse);
    });
  });

  describe("Given a complaints controller", () => {
    const mockComplaint = {
      category: "Bicing",
      title: "Bici rota",
      description: "freno roto",
      countComplaint: 1,
      image: "biciRota.jpg",
      location: "El Born",
    };
    describe("When its createComplaint method is invoked", () => {
      test("then it should call the status method with a 201 and json with the complaint created", async () => {
        const req = {} as Partial<Request>;
        const res: Partial<Response> = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn().mockResolvedValue({ newComplaint: mockComplaint }),
        };

        const next = jest.fn();
        Complaint.create = jest.fn().mockResolvedValue(mockComplaint);

        await createComplaint(
          req as Request,
          res as Response,
          next as NextFunction
        );

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
          newComplaint: mockComplaint,
        });
      });

      test("And if it throw an error creating it should next with an error", async () => {
        const error = CustomError(
          400,
          "Error creating a complaint",
          "Couldn't create the complaint"
        );
        const req = {} as Partial<Request>;
        const res: Partial<Response> = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn().mockResolvedValue([]),
        };
        const next = jest.fn();
        Complaint.create = jest.fn().mockRejectedValue(error);

        await createComplaint(
          req as Request,
          res as Response,
          next as NextFunction
        );

        expect(next).toHaveBeenCalledWith(error);
      });
    });
  });
});
