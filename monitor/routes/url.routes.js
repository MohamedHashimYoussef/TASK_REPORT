const express = require("express");
const router = express.Router();
const urlControllers = require("../controllers/url.controllers");
const { authenticateUser } = require("../middlewares/auth.middleware");

router.post("/add", [authenticateUser], urlControllers.addURL);
// router.get("/tag/:tag" , [authenticateUser] ,)
router.post("/report/:id", [authenticateUser], urlControllers.getReport);
module.exports = router;
