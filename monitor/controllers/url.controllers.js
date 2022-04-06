const urlModel = require("../models/url.model");
const client = require("../utils/redisdb");
const job = require("../jobs/job");
const fs = require("fs");
const path = require("path");
const axios = require("axios").default;
module.exports = class URL {
  constructor() {}
  static async addURL(req, res) {
    try {
      const insertURL = await urlModel.create({
        url: req.body.url,
        user_id: req.body.id,
        tag: req.body.tag,
        protocol: req.body.protocol,
        method: req.body.method,
      });
      if (insertURL) {
        await client.hIncrBy(
          `${req.body.tag}_${insertURL.id}_${req.body.id}`,
          "counter",
          0
        );

        job.startJob(
          req.body.url,
          insertURL.id,
          req.body.id,
          req.body.tag,
          req.body.method,
          req.body.email
        );
        return res.status(200).json({
          message: "Added Successfully",
          insertURL,
        });
      } else {
        return res.status(400).json({
          message: "Added",
        });
      }
    } catch (err) {
      return res.status(200).send(err);
    }
  }
  static async getReport(req, res) {
    try {
      let id = req.params.id;
      const findURLData = await urlModel.findOne({ where: { id: id } });
      console.log(findURLData.user_id);
      const key = `${findURLData.tag}_${id}_${findURLData.user_id}_queue`;
      console.log(key);
      const data = await client.sendCommand(["lrange", key, 0, 50000]);
      if (data.length > 0) {
        const nodemailer = require("nodemailer");
        let message = `REPORT URL :  ${findURLData.url}\n\n`;
        const responseTime = await client.hGet(
          `${findURLData.tag}_${id}_${findURLData.user_id}`,
          "responseTime"
        );
        const counter = await client.hGet(
          `${findURLData.tag}_${id}_${findURLData.user_id}`,
          "counter"
        );
        message += `Average Response Time : ${responseTime / counter}\n\n`;
        console.log(message);
        for (let i = 0; i < data.length; ++i) {
          if (data[i][0] == "1") {
            message += `Success      ${data[i]}+\n`;
          }
        }
        let transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "**", // generated ethereal user
            pass: "**", // generated ethereal password
          },
          tls: {
            rejectUnauthorized: false,
          },
        });
        let mailOptions = {
          from: '"Bosta 👻"',
          to: req.body.email,
          subject: "Report Mail",
          text: message,
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
            return { message: "error", error: error };
          } else {
            console.log("Email sent: " + info.response);
            return { message: "success", info: info.response };
          }
        });
      } else {
        return res.status(200).send(data);
      }
    } catch (err) {
      return res.status(400).send(err);
    }
  }
};
