import { Joi } from "express-validation";

const userRegisterDataSchema = {
  body: Joi.object({
    firstName: Joi.string().alphanum().min(5).max(15).required(),
    lastName: Joi.string().alphanum().min(5).max(15).required(),
    profileImage: Joi.string(),
    userEmail: Joi.string().email().required(),
    password: Joi.string().min(6).max(10).required(),
  }),
};

export default userRegisterDataSchema;
