const express = require("express");
const router = express.Router();

const { supportLogin } = require("../controllers/supportAuthController");

router.post("/login", supportLogin);

module.exports = router;
