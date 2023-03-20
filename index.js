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

app.get(BASE_API_URL+"/occupation-stats/loadInitialData", (request, response) => {
    if (datosJLN.length === 0) {
      datosJLN.push(mediaProvincia.datosInicialesBruno);
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

app.post(BRB,(request,response)=>{
    const newData = request.body;
    if (request.originalUrl!=BRB){ 
        response.status(405).send("Metodo no permitido");
        console.log("405");
    }else{
        if (!newData.province&&!newData.month&&!newData.traveler&&!newData.overnight_stay&&!newData.average_stay) {
            response.status(400).send('Faltan campos requeridos en el objeto');
            console.log("400");
        }else{
            const existe = operacion.arrayDatos.find(n=>n.province === newData.province && n.month === newData.month);
            if(existe){
                response.status(409).send("El objeto ya existe en el array");
                console.log("409");
            }else{
                console.log(`newData = <${JSON.stringify(newData,null,2)}>`); //verlo en la consola
                console.log("New POST to /occupation-stats");
                mediaProvincia.datosBrunopush(newData);
                response.status(201).send("Created");
            }
        }
    }
});

