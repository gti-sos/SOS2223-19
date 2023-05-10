import express from "express";
import cors from "cors";
import request from "request";


import { loadBackendJLNv1 } from "./backend/peticiones-v1.js";
import { loadBackendJLNv2 } from "./backend/peticiones-v2.js";
import {loadBackendBRBv1} from "./backend/peticiones-BRBv1.js";
import {loadBackendBRBv2} from "./backend/peticiones-BRBv2.js";
import { handler } from "./frontend/build/handler.js";

var app = express();

app.use(cors());

app.use("/", express.static("./public"));
app.use(express.json());

var port = process.env.PORT || 12345;

//proxy JLN

var paths = "/apt-occ";
var apiServerHost = "https://sos2223-14.appspot.com/api/v2/apartment-occupancy-surveys";

app.use(paths, function(req,res){
  var url = apiServerHost + req.url;
  req.pipe(request(url)).pipe(res);
});



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

