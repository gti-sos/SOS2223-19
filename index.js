import express from "express";
import cors from "cors";


import { loadBackendJLNv1 } from "./backend/peticiones-v1.js";
import { loadBackendJLNv2 } from "./backend/peticiones-v2.js";
import {loadBackendBRBv1} from "./backend/peticiones-BRBv1.js";
import {loadBackendBRBv2} from "./backend/peticiones-BRBv2.js";
import { handler } from "./frontend/build/handler.js";



var app = express();

app.use(cors());

var port = process.env.PORT || 12345;


app.use("/", express.static("./public"));
app.use(express.json());

loadBackendJLNv1(app);
loadBackendJLNv2(app); //modularizacion JLN
loadBackendBRBv1(app);
loadBackendBRBv2(app);
app.use(handler);





// const BASE_API_URL = "/api/v2";











//escuchar el puerto
app.listen(port, () => {
  console.log(`Server ready in port ${port}`);
});

// moduloBRB(app);


//---------------------------------------BRB-------------------------------------------------------------------
// var datosBRB = [];
// const BRB_URL = BASE_API_URL + "/occupancy-of-accomodation-in-rural-tourism"

