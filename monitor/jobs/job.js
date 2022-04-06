const axios = require("axios").default;
const client = require("../utils/redisdb");
module.exports = class Job {
  constructor() {}
  static async startJob(url, id, user_id, tag, method, mail) {
    setInterval(async () => {
      const startTime = new Date();
      const checkServer = await Job.callURL(
        url,
        method,
        tag,
        id,
        user_id,
        mail
      );
      const EndTime = new Date();
      console.log(EndTime - startTime);
      await client.hIncrBy(
        `${tag}_${id}_${user_id}`,
        "responseTime",
        EndTime - startTime
      );
      await client.hIncrBy(`${tag}_${id}_${user_id}`, "counter", 1);
    }, 60000);
  }
  static async callURL(url, method, tag, id, user_id, mail) {
    if (method == "get") {
      axios
        .get(url, { timeout: 1000 * 2 })
        .then(async (res) => {
          await client.hIncrBy(`${tag}_${id}_${user_id}`, "Success", 1);
          await client.lPush(
            `${tag}_${id}_${user_id}_queue`,
            `1_${new Date()}`
          );
          if ((await client.hGet(`${tag}_${id}_${user_id}`, "Failed")) >= 5) {
            await client.hSet(`${tag}_${id}_${user_id}`, "Failed", 0);
            Job.sendMail(mail, url, 1);
          }
        })
        .catch(async (err) => {
          await client.hIncrBy(`${tag}_${id}_${user_id}`, "Failed", 1);
          await client.lPush(
            `${tag}_${id}_${user_id}_queue`,
            `0_${new Date()}`
          );
          if ((await client.hGet(`${tag}_${id}_${user_id}`, "Failed")) == 5) {
            Job.sendMail(mail, url, 0);
          }
        });
    } else if (method == "post") {
      const response = await axios.post(url, { timeout: 1000 * 5 });
      if (response.status == 200) {
        return 1;
      } else {
        return 2;
      }
    } else {
      return false;
    }
  }
  static async sendMail(mail, url, status) {
    const nodemailer = require("nodemailer");

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
      to: mail,
      subject: "Verification Email",
      text: status ? `URL : ${url} is Active` : `URL : ${url} is Disable`,
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
  }
};
