const express = require("express");
const AutoSuggestController = require("./../controllers/AutoSuggest");

const router = express.Router();

router.get("/", AutoSuggestController.autosuggest);

module.exports = router;