const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const sequelize = require("./utils/MySQL");
const cors = require("cors");
const client = require("./utils/redisdb");
const axios = require("axios").default;
const job = require("./jobs/job");
/******************************Models ********************/
const urlModel = require("./models/url.model");
/****************************** Server ****************/
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/******************************* Routes ****************/
app.use("/api/v1/url", require("./routes/url.routes"));
client
  .connect()
  .then(() => {
    sequelize
      .sync()
      .then(() => {
        const server = app.listen(PORT, async () => {
          console.log(`Listening on PORT${PORT}`);
          let urlData = await urlModel.findAll();
          for (let i = 0; i < urlData.length; ++i) {
            const id = urlData[i].user_id;
            const mail = await axios.get(
              `http://localhost:3000/api/v1/auth/mail/${id}`
            );
            console.log(mail);
            Object.assign(urlData[i], { mail: mail.data.email });
            console.log(urlData[i]);
            job.startJob(
              urlData[i].url,
              urlData[i].id,
              urlData[i].user_id,
              urlData[i].tag,
              urlData[i].method,
              urlData[i].mail
            );
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  })
  .catch((err) => {
    console.log(`Redis is not connected`);
  });
process.on("SIGINT", () => {
  server.close(() => {
    console.log(`Server is closed`);
    process.exit(0);
  });
});
