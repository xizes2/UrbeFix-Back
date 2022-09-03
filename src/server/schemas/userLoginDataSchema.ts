import { Joi } from "express-validation";

const userRegisterDataSchema = {
  body: Joi.object({
    userEmail: Joi.string().email().required(),
    password: Joi.string().min(6).max(15).required(),
  }),
};

export default userRegisterDataSchema;
