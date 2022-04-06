const Joi = require("joi");
const axios = require("axios").default;

const authenticateUser = async (req, res, next) => {
  try {
    const schema = Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required().min(6).max(20),
      url: Joi.string(),
      tag: Joi.string().min(1),
      protocol: Joi.string().valid("http", "https", "tcp"),
      method: Joi.string().valid("get", "post"),
    });

    const { error, value } = schema.validate(req.body);
    console.log(req.body);
    if (error) {
      return res.status(400).json({
        status: 400,
        error: error.details[0].message,
      });
    } else {
      const response = await axios.post(
        "http://localhost:3000/api/v1/auth/login",
        {
          email: req.body.email,
          password: req.body.password,
        }
      );
      if (response.status == 400) {
        return res.status(400).json({
          message: "Failed Login",
        });
      } else {
        Object.assign(req.body, { id: response.data.id });
        next();
      }
    }
  } catch (err) {
    return res.status(400).send(err);
  }
};

module.exports = { authenticateUser };
