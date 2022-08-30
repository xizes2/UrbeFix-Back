import "../loadEnvironments";
import chalk from "chalk";
import Debug from "debug";
import mongoose from "mongoose";

const debug = Debug("urbefix:database:index");

const connectDatabase = (mongoUrl: string) => {
  const promise = new Promise((resolve, reject) => {
    mongoose.set("toJSON", {
      virtuals: true,
      transform: (doc, ret) => {
        const newDocument = { ...ret };

        // eslint-disable-next-line no-underscore-dangle
        delete newDocument.__v;
        // eslint-disable-next-line no-underscore-dangle
        delete newDocument._id;
        delete newDocument.passwd;
        return newDocument;
      },
    });

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
