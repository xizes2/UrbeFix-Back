import Router from "express";
import {
  getAllComplaints,
  deleteComplaint,
  getComplaint,
} from "../../controllers/complaints/complaintsController";
import { authentication } from "../../middleware/authentication";

const complaintsRouter = Router();

complaintsRouter.get("/", getAllComplaints);
complaintsRouter.delete("/delete/:id", authentication, deleteComplaint);
complaintsRouter.get("/details/:id", authentication, getComplaint);

export default complaintsRouter;
