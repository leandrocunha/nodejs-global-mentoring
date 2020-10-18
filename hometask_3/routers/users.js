const express = require('express');
const UserController = require("../controllers/User");

const router = express.Router();

router.get("/", UserController.listAll);
router.get("/:uuid", UserController.get);
router.post("/", UserController.create);
router.put("/:uuid", UserController.update);
router.delete("/:uuid", UserController.remove);

module.exports = router;