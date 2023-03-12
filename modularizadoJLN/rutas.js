const express = require("express");
const router = express.Router();
const peticiones = require('./peticiones');

const JLN = BASE_API_URL+"/occupation-stats";

router.get("",peticiones.cargaDatos);

module.exports = router;