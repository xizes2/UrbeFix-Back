import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "..";
import connectDatabase from "../../database";
import mongoose from "mongoose";
import { User } from "../../database/models/User";

let mongoServer: MongoMemoryServer;

const userRegisterData = {
  firstName: "Julia",
  lastName: "Amada",
  userEmail: "julia@gmail.com",
  password: "juliapass",
};

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
  describe("When it receives a request with username 'Julia', a last name 'Amada', user email 'julia@gmail.com' and password 'juliapass' ", () => {
    test("Then it should respond with status 201, and the new user data", async () => {
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
        lastName: "Ukun",
        userEmail: "arcus@gmail.com",
      };
      const errorMessage = "Validation Failed";

      const { body } = await request(app)
        .post("/users/register")
        .send(userDataWrong)
        .expect(400);

      expect(body).toHaveProperty("error", errorMessage);
    });
  });
});
