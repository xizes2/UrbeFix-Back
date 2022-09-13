import Router from "express";
import multer from "multer";
import {
  getAllComplaints,
  deleteComplaint,
  getComplaint,
  createComplaint,
} from "../../controllers/complaints/complaintsController";
import { authentication } from "../../middleware/authentication";
import renameImageFile from "../../middleware/renameImageFile";
import supaBaseUpload from "../../middleware/supaBaseUpload";

const upload = multer({ dest: "uploads", limits: { fileSize: 3000000 } });
const complaintsRouter = Router();

complaintsRouter.get("/", getAllComplaints);
complaintsRouter.delete("/delete/:id", authentication, deleteComplaint);
complaintsRouter.get("/details/:id", authentication, getComplaint);
complaintsRouter.post(
  "/",
  upload.single("image"),
  authentication,
  renameImageFile,
  supaBaseUpload,
  createComplaint
);

export default complaintsRouter;
