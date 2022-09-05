import Router from "express";
import getAllComplaints from "../../controllers/complaints/complaintsController";
import { authentication } from "../../middleware/authentication";

const complaintsRouter = Router();

complaintsRouter.get("/", getAllComplaints);
complaintsRouter.delete("/:id", authentication, deleteComplaint);

export default complaintsRouter;
