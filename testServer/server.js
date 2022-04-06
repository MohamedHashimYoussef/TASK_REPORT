const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;
const cors = require("cors");
const { setTimeout } = require("timers/promises");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  console.log("Called!!!");
  res.status(200).send("hello");
});

app.get("/disable", (req, res) => {
  console.log("Called Delay");
  //   setTimeout(() => {
  //     return res.status(200).send("done");
  //   }, 180000);
  return res.status(200).send("Thanks");
});

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});
