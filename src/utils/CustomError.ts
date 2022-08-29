import ICustomError from "../interfaces/ICustomError";

const CustomError = (
  code: number,
  publicMessage: string,
  privateMessage: string
): ICustomError => {
  const error = new Error(privateMessage) as ICustomError;
  error.code = code;
  if (publicMessage) {
    error.publicMessage = publicMessage;
  }
  return error;
};

export default CustomError;
