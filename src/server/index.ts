import Express from "express";
import cors from "cors";
import morgan from "morgan";
import { generalError, notFoundError } from "./middleware/errors";
import usersRouter from "./routers/users/usersRouters";
import complaintsRouter from "./routers/complaints/complaintsRouters";

const app = Express();

app.use(cors());
app.use(morgan("dev"));
app.use(Express.static("uploads"));
app.use(Express.json());

app.use("/users", usersRouter);
app.use("/complaints", complaintsRouter);

app.use(notFoundError);
app.use(generalError);

export default app;
