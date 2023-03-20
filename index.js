var express = require("express");
var bodyParser = require("body-parser");

var mediaProvincia = require("./index-BRB");



var app = express();
var port = process.env.PORT || 12345;

app.use(bodyParser.json());
app.use("/",express.static("./public"));

const router = require("./backend/rutas");
const { response } = require("express");

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

  app.get(BRB_URL,(request,response)=>{
    console.log("nuevo get a /occupancy");
    response.status(201).json(datosBRB);
});



// tabla azul
//-----------------------------POST------------------------------------------------------------
const camposObligatoriosBRB = ["province","month","traveller","overnight_stay","average_stay"];
  app.post(BRB_URL, (request,response)=>{
    var nuevo = request.body;
    var existeObjeto = datosBRB.filter(function(dato) {
      return datosBRB.province == nuevo.province && datosBRB.month == nuevo.month;
    })
  if(camposObligatoriosBRB.find((n) => !nuevo[n])) {
    response.status(400).send('BAD REQUEST, faltan campos requeridos en el objeto');
    console.log('400');

  }else if (existeObjeto.length > 0) {
      response.status(409).send('CONFLICT, el objeto ya existe en la base de datos');
      console.log('409');
  } else {
      console.log(`newData = <${JSON.stringify(nuevo, null, 2)}>`);
      console.log('New POST to /occupation-stats');
      datosBRB.push(nuevo);
      response.status(201).send('Created');
  }
  
});

app.post(BRB_URL +"/:campo",(req, res) => {
  res.status(405).send('Method not Allowed');
  console.log(`Error 405 Method not Allowed`);
});

//-------------------------PUT-------------------
app.put(BRB_URL+"/:campo/:dato",(request,response) => {
       const campo = request.params.campo;
       const dato = request.params.dato;
       const newData = request.body;
  
       const objIndex =  mediaProvincia.datosBruno.find(n=>n.province === campo && n.month === dato);
       if(objIndex === 0){
           response.status(404).send(`No se encontraron datos con el campo ${campo}`);
       }else{
           if (camposObligatoriosBRB.find(n => !newData[n])) {
               response.status(400).send('BAD REQUEST');
               console.log("400");
           }else{
               for (let p in newData) {
                   objIndex[p] = newData[p];
               }
               console.log(`New PUT to /${campo}/${dato}`);
               response.status(200).send("OK");
           }
       }
   });

/*app.get(BRB_URL + "/province/month", (req,res) => {
    const province = req.body;
    const month = req.query.month;
    const RECURSO = datosBRB.filter(n => n.hasOwnProperty(province) && n.hasOwnProperty(month));
    /*datosBRB.findOne({province:province,month:month}, (err, array) => {
      const lc = array.filter(n => n.hasOwnProperty(province) && n.hasOwnProperty(month));
      if (err) {
          res.status(500).send('INTERNAL SERVER ERROR');
          console.log(err);
      } else if(lc===0) {
          res.status(404).send(`No se encontraron datos con el campo "${province}" igual a "${month}"`);
          console.log(404);
      }else{
          res.send(lc);

          console.log(`Returned ${lc.length}`);
      }
  });
    console.log(`recurso= <${JSON.stringify(province,null,2)}>`);
    res.send(RECURSO);
})*/





