import Express from "express";
import cors from "cors";
import morgan from "morgan";
import { generalError, notFoundError } from "../middleware/errors";

const app = Express();

app.use(cors());
app.use(morgan("dev"));
app.use(Express.json());

app.use(notFoundError);
app.use(generalError);

export default app;
