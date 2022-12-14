import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../..";
import connectDatabase from "../../../database";
import mongoose from "mongoose";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mockedDbUrl = mongoServer.getUri();

  await connectDatabase(mockedDbUrl);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Given the endpoint POST /users/register", () => {
  const userRegisterData = {
    firstName: "Julia",
    firstSurname: "Amada",
    userEmail: "julia@gmail.com",
    password: "juliapass",
  };
  describe("When it receives a request with username 'Julia', a last name 'Amada', user email 'julia@gmail.com' and password 'juliapass' ", () => {
    test("Then it should respond with status 201, a success message", async () => {
      const correctMessage = "Registered user correctly!";
      const { body } = await request(app)
        .post("/users/register")
        .send(userRegisterData)
        .expect(201);
      expect(body).toHaveProperty("message", correctMessage);
    });
  });

  describe("When it receives a request without a password", () => {
    test("Then it should response with a status 400 and a message 'Error creating new user'", async () => {
      const userDataWrong = {
        firstName: "Arcus",
        firstSurname: "Ukun",
        userEmail: "arcus@gmail.com",
      };
      const errorMessage = "Validation Failed";

      const { body } = await request(app)
        .post("/users/register")
        .send(userDataWrong)
        .expect(400);

      expect(body).toHaveProperty("error");
    });
  });
});

describe("Given the endpoint POST /users/login", () => {
  describe("When it receives a request with user email 'julia@gmail.com' and password 'juliapass' ", () => {
    test("Then it should respond with status 200, and an object cocontaining the user token", async () => {
      const userLoginData = {
        userEmail: "julia@gmail.com",
        password: "juliapass",
      };

      const { body } = await request(app)
        .post("/users/login")
        .send(userLoginData)
        .expect(200);
      expect(body).toHaveProperty("user");
    });
  });

  describe("When it receives a request with user email 'julia@gmail.com' and wrong  password ", () => {
    test("Then it should respond with status 401 and an error message", async () => {
      const userLoginData = {
        userEmail: "julia@gmail.com",
        password: "nuriapass",
      };

      const { body } = await request(app)
        .post("/users/login")
        .send(userLoginData)
        .expect(401);
      expect(body).toHaveProperty("error");
    });
  });
});
