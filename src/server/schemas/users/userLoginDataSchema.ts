import { Joi } from "express-validation";

const userLoginDataSchema = {
  body: Joi.object({
    userEmail: Joi.string().email().required(),
    password: Joi.string().min(6).max(15).required(),
  }),
};

export default userLoginDataSchema;
