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
const BRB_URL = BASE_API_URL + "/occupancy-of-accomodation-in-rural-tourism"

app.get(BRB_URL +"/loadInitialData", (request, response) => {
    if (datosBRB.length === 0) {
      datosBRB.concat(mediaProvincia.datosInicialesBruno);
      datosBRB.push(mediaProvincia.datosInicialesBruno);
      response.status(201).json(datosBRB);
      console.log("Carga de datos iniciales realizada");
     
    } else {
      response.status(409).send("El array ya tiene datos");
      console.log("El array ya tiene datos, tiene " + datosBRB.length);
      console.log(409);
    }
  });

  app.get(BRB_URL, (request,response)=>{
    response.status(200).json(datosBRB);
    console.log("New request to /occupancy-of-accomodation-in-rural-tourism");
});





