import chalk from "chalk";
import Debug from "debug";
import app from ".";
import ICustomError from "../interfaces/ICustomError";

const debug = Debug("urbefix:server:startServer");

const startServer = (port: number) =>
  new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      debug(
        chalk.bgGreenBright(`Server listening on http://localhost:${port}`)
      );
      resolve(true);
    });

    server.on("error", (error: ICustomError) => {
      debug(
        chalk.bgRedBright(
          `Error code: ${error.statuscode}, Error starting the server`
        )
      );
      reject(error);
    });
  });

export default startServer;
