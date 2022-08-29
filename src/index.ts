import connectDatabase from "./database";
import "./loadEnvironments";

const databaseUrl = process.env.MONGOURL;

(async () => {
  try {
    await connectDatabase(databaseUrl);
  } catch (error) {
    process.exit(1);
  }
})();
