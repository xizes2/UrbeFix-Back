import Express from "express";
import cors from "cors";
import morgan from "morgan";
import { generalError, notFoundError } from "./middleware/errors";
import usersRouter from "./routers/usersRouters";

const app = Express();

app.use(cors());
app.use(morgan("dev"));
app.use(Express.json());

app.use("/users", usersRouter);

app.use(notFoundError);
app.use(generalError);

export default app;
