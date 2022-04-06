const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const sequelize = require("./utils/MySQL");
const cors = require("cors");

/****************************** Models **************************************/
const userTable = require("./models/User.model");
/******************************* Server **************************************/
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/****************************** Routes **************************************/
app.use("/api/v1/auth", require("./routes/user.routes"));

sequelize
  .sync()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
process.on("SIGINT", () => {
  server.close(() => {
    console.log("Server is closed");
    process.exit(0);
  });
});
