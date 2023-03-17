var express = require("express");
var bodyParser = require("body-parser");

var mediaProvincia = require("./index-BRB");

var app = express();
var port = process.env.PORT || 12345;

app.use(bodyParser.json());
app.use("/",express.static("./public"));

const router = require("./backend/rutas");

const BASE_API_URL = "/api/v1";

app.use("",router); //modularizacion JLN


//index brb
app.get("/samples/BRB",(req,res) =>{
    var media = mediaProvincia.mediaGeografica("Almeria","traveller");
    res.send(`la media de viajeros en almeria es: ${media}`);
    console.log("->  media aritmetica almeria traveller  <-");
});





//escuchar el puerto
app.listen(port,()=>{
    console.log(`Server ready in port ${port}`);
});



//---------------------------------------BRB-------------------------------------------------------------------
var datosBRB = [];

app.get(BASE_API_URL+"/occupancy-of-accomodation-in-rural-tourism/loadInitialData", (request, response) => {
    if (datosBRB.length === 0) {
      datosBRB.push(mediaProvincia.datosInicialesBruno);
      response.json(datosBRB);
      console.log("Carga de datos iniciales realizada");
      response.sendStatus(201);
    } else {
      response.status(409).send("El array ya tiene datos");
      console.log("El array ya tiene datos, tiene " + datosBRB.length);
      console.log(409);
    }
  });

  app.get(BASE_API_URL+"/occupancy-of-accomodation-in-rural-tourism", (request,response)=>{
    response.json(mediaProvincia.datosBruno);
    console.log("New request to /occupancy-of-accomodation-in-rural-tourism");
    response.sendStatus(200);
});

const BRB = BASE_API_URL+"/occupancy-of-accomodation-in-rural-tourism";



