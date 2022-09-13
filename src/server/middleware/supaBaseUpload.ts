import { createClient } from "@supabase/supabase-js";
import { NextFunction, Request, Response } from "express";
import { readFile } from "fs/promises";
import path from "path";
import CustomError from "../../utils/CustomError";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const supaBaseUpload = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { image } = req.body;
  const imagePath = path.join("uploads", image);

  try {
    const fileData = await readFile(imagePath);

    const storage = supabase.storage.from("urbefix");

    const uploadResult = await storage.upload(image, fileData);
    if (uploadResult.error) {
      next(uploadResult.error);
      return;
    }
    const { publicURL } = storage.getPublicUrl(image);

    req.body.imageBackUp = publicURL;

    next();
  } catch (error) {
    const newError = CustomError(
      500,
      "Couldn't upload or read the image",
      "Error while reading and uploading the image"
    );
    next(newError);
  }
};

export default supaBaseUpload;
