import express from "express";

//var mediaProvincia = require("./index-BRB");
import { loadBackendJLN } from "./backend/peticiones.js";
import { handler } from "./frontend/build/handler.js";


var app = express();
var port = process.env.PORT || 12345;


app.use("/", express.static("./public"));
app.use(express.json());
loadBackendJLN(app); //modularizacion JLN
app.use(handler);

// var moduloBRB = require("./backend/peticiones-BRB");

// const BASE_API_URL = "/api/v1";











//escuchar el puerto
app.listen(port, () => {
  console.log(`Server ready in port ${port}`);
});

// moduloBRB(app);


//---------------------------------------BRB-------------------------------------------------------------------
// var datosBRB = [];
// const BRB_URL = BASE_API_URL + "/occupancy-of-accomodation-in-rural-tourism"

/*
app.delete(BRB_URL + "/:campo/:valor", (req, res) => {
  const campo = request.params.campo;
  const valor = request.params.valor;
  const objetosFiltrados = mediaProvincia.datosInicialesBruno.filter(objeto => !(objeto[campo] === valor));
  if (objetosFiltrados.length !== mediaProvincia.datosInicialesBruno.length) {
    mediaProvincia.datosInicialesBruno = objetosFiltrados;
    response.status(200).send("OK");
  }
  response.status(404).send("NOT FOUND");
})

app.get(BRB_URL + "/:province/:month", (req, res) => {
  const province = req.params.province;
  const month = req.params.month;
  const RECURSO = datosBRB.filter(function (dato) {
    return datosBRB.province == province && datosBRB.month == month;
  });
  console.log(RECURSO);
    //const lc = array.filter(n => n.hasOwnProperty(province) && n.hasOwnProperty(month));
    /*datosBRB.findOne({province:province,month:month}, (err, array) => {
      const lc = array.filter(n => n.hasOwnProperty(province) && n.hasOwnProperty(month));
      if (err) {
          res.status(500).send('INTERNAL SERVER ERROR');
          console.log(err);
      } else if (RECURSO.length === 0) {
    res.status(404).send(`No se encontraron datos con el campo "${province}" igual a "${month}"`);
    console.log(404);
  } else {
    res.send(RECURSO);

    console.log(`Returned ${RECURSO.length}`);
  }
});*/





