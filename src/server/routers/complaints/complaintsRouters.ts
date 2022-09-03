import Router from "express";
import getAllComplaints from "../../controllers/complaints/complaintsController";

const complaintsRouter = Router();

complaintsRouter.get("/", getAllComplaints);

export default complaintsRouter;
