import Joi from "joi";
import CustomErrorHandler from "../service/customErrorHandler.js";
import bcrypt from "bcrypt";
import { userModel } from "../models/auth.model.js";
import JwtService from "../service/JwtService.js";

export const authController = {
  register: async (req, res, next) => {
    const registerUserSchema = Joi.object({
      name: Joi.string().required().min(3).max(30),
      email: Joi.string().required().email(),
      password: Joi.string()
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        )
        .message(
          "Password must contain minimum eight characters, at least one uppercase letter, one lowercase letter, one number, and one special character"
        )
        .required(),
    });

    const { error } = registerUserSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { name, email, password } = req.body;

    try {
      const existingUser = await userModel.findOne({ email: email });
      if (existingUser) {
        return res.status(401).json({
          success: false,
          message: "Email already Exists Try another One",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await userModel.create({
        name,
        email,
        password: hashedPassword,
        verified: true,
      });

      return res.status(200).json({
        success: true,
        message: "Registration Successfull",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong" + error.message,
      });
    }
  },

  login: async (req, res, next) => {
    const loginSchema = Joi.object({
      email: Joi.string().required(),
      password: Joi.string()
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        )
        .message(
          "Password must contain minimum eight characters, at least one uppercase letter, one lowercase letter, one number, and one special character"
        )
        .required(),
    });

    const { error } = loginSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { email, password } = req.body;

    try {
      const user = await userModel.findOne({ email: email });

      if (!user) {
        return next(
          CustomErrorHandler.wrongCredentials("Incorrect email or password")
        );
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return next(
          CustomErrorHandler.wrongCredentials("Incorrect email or password")
        );
      }

      const payload = {
        _id: user._id,
      };

      const token = JwtService.sign(payload, process.env.JWT_SECRET);

      return res.json({
        token: token,
        id: user._id,
        name: user.name,
        message: "Login Successful",
      });
    } catch (error) {
      return next(err);
    }
  },
};
