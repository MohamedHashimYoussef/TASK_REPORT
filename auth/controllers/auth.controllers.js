const Joi = require("joi");
const userModel = require("../models/User.model");
const { sendVerifictaionMail } = require("../helpers/mailer.helper");

module.exports = class User {
  constructor() {}
  static async createUser(req, res) {
    try {
      console.log(req.body);
      const schema = Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required().min(6).max(20),
        first_name: Joi.string().required().min(2).max(20),
        last_name: Joi.string().required().min(2).max(20),
      });

      const { error, value } = schema.validate(req.body);
      console.log(error);
      if (error) {
        return res.status(400).json({
          status: 400,
          error: error.details[0].message,
        });
      }
      const insertUser = await userModel.create(value);
      if (insertUser) {
        const mailResponse = await sendVerifictaionMail(req.body.email);
        return res.status(200).json({
          message: "Successful Register",
        });
      } else {
        return res.status(400).json({
          message: "Failed Register",
        });
      }
    } catch (err) {
      res.status(500).json({ message: err.errors[0].message });
    }
  }
  static async verifyEmail(req, res) {
    let email = req.params.email;
    if (email) {
      const user = await userModel.findOne({ where: { email: email } });
      if (user) {
        if (!user.verified) {
          user.verified = true;
          await user.save();
        }
        return res.status(200).json({
          message: "Email Verified",
        });
      } else {
        return res.status(400).json({
          message: "Email Not Verified",
        });
      }
    } else {
      return res.status(400).json({
        message: "Email Not Found",
      });
    }
  }
  static async loginUser(req, res) {
    try {
      const schema = Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required().min(6).max(20),
      });

      const { error, value } = schema.validate(req.body);
      console.log(error);
      if (error) {
        return res.status(400).json({
          status: 400,
          error: error.details[0].message,
        });
      } else {
        const findUser = await userModel.findOne({
          where: {
            email: req.body.email,
            password: req.body.password,
          },
        });
        if (findUser) {
          if (findUser.verified) {
            console.log(">>>>>>>>>>");
            return res
              .status(200)
              .json({ message: "Successful Login", id: findUser.id });
          } else {
            return res.status(400).json({ message: "Email Not Verified" });
          }
        } else {
          return res.status(400).json({ message: "Failed Login" });
        }
      }
    } catch (err) {
      res.status(500).json({ message: err.errors[0].message });
    }
  }
  static async getMail(req, res) {
    let id = req.params.id;
    const Data = await userModel.findOne({ where: { id: id } });
    return res.status(200).json({ email: Data.email });
  }
};
