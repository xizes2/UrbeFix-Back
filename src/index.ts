import connectDatabase from "./database";
import "./loadEnvironments";
import startServer from "./server/startServer";

const databaseUrl = process.env.MONGOURL;
const serverPort = process.env.PORT;

(async () => {
  try {
    await connectDatabase(databaseUrl);
    await startServer(+serverPort);
  } catch (error) {
    process.exit(1);
  }
})();
