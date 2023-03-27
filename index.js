var express = require("express");
var bodyParser = require("body-parser");

//var mediaProvincia = require("./index-BRB");

var backendJLN = require('./backend/peticiones');



var app = express();
var port = process.env.PORT || 12345;

app.use(bodyParser.json());
app.use("/", express.static("./public"));

const { response } = require("express");
var moduloBRB = require("./backend/peticiones-BRB");

const BASE_API_URL = "/api/v1";

backendJLN(app); //modularizacion JLN









//escuchar el puerto
app.listen(port, () => {
  console.log(`Server ready in port ${port}`);
});

moduloBRB(app);


//---------------------------------------BRB-------------------------------------------------------------------
var datosBRB = [];
const BRB_URL = BASE_API_URL + "/occupancy-of-accomodation-in-rural-tourism"

