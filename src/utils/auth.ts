import "../loadEnvironments";
import bcrypt from "bcryptjs";
import ICustomJwtPayload from "../interfaces/ICustomJwtPayload";
import jwt from "jsonwebtoken";

export const hashCreator = (text: string) => bcrypt.hash(text, 10);

export const hashCompare = (text: string, hash: string) =>
  bcrypt.compare(text, hash);

export const createToken = (payload: ICustomJwtPayload) =>
  jwt.sign(payload, process.env.SECRET);
