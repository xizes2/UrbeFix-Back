import { Request } from "express";
import ICustomJwtPayload from "./ICustomJwtPayload";

interface ICustomRequest extends Request {
  payload: ICustomJwtPayload;
}

export default ICustomRequest;
