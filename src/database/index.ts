import "../loadEnvironments";
import chalk from "chalk";
import Debug from "debug";
import mongoose from "mongoose";

const debug = Debug("urbefix:database:index");

const connectDatabase = (mongoUrl: string) => {
  const promise = new Promise((resolve, reject) => {
    mongoose.connect(mongoUrl, (error) => {
      if (error) {
        debug(chalk.bgRedBright("Error connecting to database", error.message));
        reject(error);
        return;
      }

      debug(chalk.bgGreenBright("Connected to database"));
      resolve(true);
    });
  });
  return promise;
};

export default connectDatabase;
