interface ICustomError extends Error {
  statuscode: number;
  publicMessage?: string;
}

export default ICustomError;
