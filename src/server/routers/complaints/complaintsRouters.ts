import Router from "express";
import {
  getAllComplaints,
  deleteComplaint,
  getComplaint,
  createComplaint,
} from "../../controllers/complaints/complaintsController";
import { authentication } from "../../middleware/authentication";

const complaintsRouter = Router();

complaintsRouter.get("/", getAllComplaints);
complaintsRouter.delete("/delete/:id", authentication, deleteComplaint);
complaintsRouter.get("/details/:id", getComplaint);
complaintsRouter.post("/", createComplaint);

export default complaintsRouter;
