var express = require("express");
var bodyParser = require("body-parser");

var mediaProvincia = require("./index-BRB");

var backendJLN = require('./backend/peticiones');



var app = express();
var port = process.env.PORT || 12345;

app.use(bodyParser.json());
app.use("/", express.static("./public"));

const { response } = require("express");

const BASE_API_URL = "/api/v1";

backendJLN(app); //modularizacion JLN







//escuchar el puerto
app.listen(port, () => {
  console.log(`Server ready in port ${port}`);
});



//---------------------------------------BRB-------------------------------------------------------------------
var datosBRB = [];
const BRB_URL = BASE_API_URL + "/occupancy-of-accomodation-in-rural-tourism"

app.get(BRB_URL + "/loadInitialData", (request, response) => {
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

app.get(BRB_URL, (request, response) => {
  console.log("nuevo get a /occupancy");
  response.status(201).json(datosBRB);
});



// tabla azul
//-----------------------------POST------------------------------------------------------------
const camposObligatoriosBRB = ["province", "month", "traveller", "overnight_stay", "average_stay"];
app.post(BRB_URL, (request, response) => {
  var nuevo = request.body;
  var arrayAux = datosBRB;
  arrayAux.filter(function (dato) {
    return datosBRB.province == nuevo.province && datosBRB.month == nuevo.month;
  });
  if (camposObligatoriosBRB.find((n) => !nuevo[n])) {
    response.status(400).send('BAD REQUEST, faltan campos requeridos en el objeto');
    console.log('400');

  } else if (arrayAux.length > 0) {
    response.status(409).send('CONFLICT, el objeto ya existe en la base de datos');
    console.log('409');
  } else {
    console.log(`newData = <${JSON.stringify(nuevo, null, 2)}>`);
    console.log('New POST to /occupation-stats');
    datosBRB.push(nuevo);
    response.status(201).send('Created');
  }

});

app.post(BRB_URL + "/:campo", (req, res) => {
  res.status(405).send('Method not Allowed');
  console.log(`Error 405 Method not Allowed`);
});

//-------------------------PUT-------------------
app.put(BRB_URL + "/:province/:month", (request, response) => {
  const provincia = request.params.province;
  const mes = request.params.month;
  const newData = request.body;
  var arrayAux = datosBRB;
  arrayAux.filter(function (dato) {
    return datosBRB.province == provincia && datosBRB.month == mes;
  });
  console.log(arrayAux);
  if (arrayAux.length === 0) {
    response.status(404).send(`No se encontraron datos con el campo ${provincia}`);
  } else {
    if (camposObligatoriosBRB.find(n => !newData[n])) {
      response.status(400).send('BAD REQUEST');
      console.log("400");
    } else {
      console.log(`New PUT to /${provincia}/${mes}`);
      response.status(200).send('ok');
    }
  }
});

app.put(BRB_URL, (req, res) => {
  res.status(405).send('Method not Allowed');
  console.log(`Error 405 Method not Allowed`);
});

app.delete(BRB_URL + "/:campo", (req, res) => {
  const campo = request.params.campo;
  const objetosFiltrados = mediaProvincia.datosInicialesBruno.filter(objeto => !objeto.hasOwnProperty(campo));
  if (objetosFiltrados.length !== mediaProvincia.datosInicialesBruno.length) {
    mediaProvincia.datosInicialesBruno = objetosFiltrados;
    response.status(200).send("OK");
  } else {
    response.status(404).send("NOT FOUND");
  }
});

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
      } else*/ if (RECURSO.length === 0) {
    res.status(404).send(`No se encontraron datos con el campo "${province}" igual a "${month}"`);
    console.log(404);
  } else {
    res.send(RECURSO);

    console.log(`Returned ${RECURSO.length}`);
  }
});





