import { NextFunction, Request, Response } from "express";
import fs from "fs/promises";
import path from "path";
import IComplaintRegisterData from "../../interfaces/IComplaintRegisterData";
import CustomError from "../../utils/CustomError";
import renameImageFile from "./renameImageFile";

jest.useFakeTimers();

describe("Given a parseData middleware", () => {
  describe("When it receive a request, a response and a next function", () => {
    const mockedComplaint: IComplaintRegisterData = {
      category: "fuente",
      title: "Fuente rota",
      countComplaints: 1,
      image: "fuente.jpg",
      location: [41.5, 2.17],
    };

    const complaintJson = JSON.stringify(mockedComplaint);

    jest
      .spyOn(path, "join")
      .mockReturnValue(`${path.join("uploads", "image")}`);

    jest.spyOn(fs, "rename").mockResolvedValue();

    const req = {
      body: { newComplaint: complaintJson },
      file: { filename: "fuente", originalname: "fuente" },
    } as Partial<Request>;

    const res = {} as Partial<Response>;

    const next = jest.fn() as NextFunction;

    test("Then it should asign the data as req body", async () => {
      await renameImageFile(req as Request, res as Response, next);

      expect(req.body).toStrictEqual({
        ...mockedComplaint,
        image: `${Date.now()}${req.file.filename}`,
      });
      expect(next).toHaveBeenCalled();
    });

    test("If it get an error it must call the next function with the error created", async () => {
      const reqWithoutImage = {
        body: { newComplaint: mockedComplaint },
      } as Partial<Request>;

      const newError = CustomError(404, "You must add", "Missing data");
      await renameImageFile(reqWithoutImage as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(newError);
    });
  });
});
