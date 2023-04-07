import express from "express";
<<<<<<< HEAD
import cors from "cors";
=======
>>>>>>> b07398615915bf4d5054814f713e2435674e870a

//var mediaProvincia = require("./index-BRB");
import { loadBackendJLN } from "./backend/peticiones.js";
import { handler } from "./frontend/build/handler.js";


var app = express();

app.use(cors());

var port = process.env.PORT || 12345;


app.use("/", express.static("./public"));
app.use(express.json());
loadBackendJLN(app); //modularizacion JLN
app.use(handler);

<<<<<<< HEAD

// var moduloBRB = require("./backend/peticiones-BRB");

// const BASE_API_URL = "/api/v1";

=======
// var moduloBRB = require("./backend/peticiones-BRB");

// const BASE_API_URL = "/api/v1";

>>>>>>> b07398615915bf4d5054814f713e2435674e870a










//escuchar el puerto
app.listen(port, () => {
  console.log(`Server ready in port ${port}`);
});

// moduloBRB(app);


//---------------------------------------BRB-------------------------------------------------------------------
// var datosBRB = [];
// const BRB_URL = BASE_API_URL + "/occupancy-of-accomodation-in-rural-tourism"

