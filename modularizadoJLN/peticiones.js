var express = require("express");
var bodyParser = require("body-parser");

var operacion = require('./index-JLN');

var app = express();

app.use(bodyParser.json());

const BASE_API_URL = "/api/v1";
const JLN = BASE_API_URL + "/occupation-stats";

//index jln
const camposObligatorios = ["province","month","traveler","overnight_stay","average_stay"];

const calculoMedia = (req,res) =>{
    pr = "Almeria";
    c = "traveler";
    var media = operacion.avgDatos(operacion.arrayDatos,pr, c);
    res.send("La media de " + c + " en " + pr + " es de " + media + " " + c + "s.");
    console.log(`->  media aritmetica  ${pr} ${c} calculada  <-`);
};

var datosJLN = [];
const cargaInicial = (request, response) => {
    if (datosJLN.length === 0) {
      datosJLN.concat(operacion.datosIni);
      datosJLN.push(operacion.datosIni);
      console.log("Carga de datos iniciales realizada");
      response.status(201).send("Created");
      response.json(datosJLN);
    } else {
      response.status(409).send("CONFLICT, el array ya tiene datos");
      console.log("El array ya tiene datos, tiene " + datosJLN.length);
      console.log(409);
    }
};

const cargaDatos = (request,response)=>{
    response.json(operacion.datosIni);
    console.log("New request to /occupation-stats");
    response.status(200).send("OK");
};

const cargaDatosJLN = (request,response)=>{
    response.json(operacion.datosIni);
    console.log("New request to /occupation-stats");
};

// Tabla azul y códigos de la verde

const postObjeto = (request,response)=>{
    const newData = request.body;
    if (request.originalUrl!=JLN){
        response.status(405).send("METHOD NOT ALLOWED");
        console.log("405");
    }else{
        if (camposObligatorios.find(n => !newData[n])) {
            response.status(400).send('BAD REQUEST, faltan campos requeridos en el objeto');
            console.log("400");
        }else{
            const existe = operacion.arrayDatos.find(n=>n.province === newData.province && n.month === newData.month);
            if(existe){
                response.status(409).send("CONFLICT, el objeto ya existe en el array");
                console.log("409");
            }else{
                console.log(`newData = <${JSON.stringify(newData,null,2)}>`); //verlo en la consola
                console.log("New POST to /occupation-stats");
                operacion.arrayDatos.push(newData);
                response.status(201).send("Created");
            }
        }
    }
};

const errPosteo = (req, res) => {
    res.status(405).send('Method not Allowed');
    console.log(`Error 405 Method not Allowed`);
};
//obtener array de un valor de un campo en especifico
const cargaValorCampo = (request,response)=>{
    const campo = request.params.campo;
    const valor = request.params.valor;
    const arrayfiltrado = operacion.arrayDatos.filter(n=>n[campo] === valor);

    if(arrayfiltrado.length === 0){
        response.status(404).send(`No se encontraron datos con el campo "${campo}" igual a "${valor}"`);
        console.log(404);
    }else{
        response.status(200).send(arrayfiltrado);
        console.log(`New GET to /${campo}/${valor}`);
    }
};

//obtener array de un campo en especifico
const cargaListCampo = (request, response) => {
    const campo = request.params.campo;
    const lc = operacion.arrayDatos.filter(n => n.hasOwnProperty(campo)).map(c => c[campo]);
    if (lc.length === 0) {   
      response.status(404).send(`No se encontraron datos con el campo "${campo}"`);
      console.log(404);
    } else {
      response.status(200).send(lc);
      console.log(`New GET to /${campo}`);
    }
};

//Actualizar dato en especifico

const actualizarObj = (request,response) => {
    const campo = request.params.campo;
    const dato = request.params.dato;
    const newData = request.body;

    const objIndex =  operacion.arrayDatos.find(n=>n.province === campo && n.month === dato);
    if(objIndex === 0){
        response.status(404).send(`No se encontraron datos con el campo ${campo}`);
    }else{
        if (camposObligatorios.find(n => !newData[n])) {
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
};

const errActualizar = (req, res) => {
    res.status(405).send('METHOD NOT ALLOWED');
    console.log(`Method not Allowed`);
};

//Borrar un determinado campo
const borrarCampo = (request, response) => {
    const campo = request.params.campo; 
    const objetosFiltrados = operacion.datosIni.filter(objeto => !objeto.hasOwnProperty(campo));
    if(objetosFiltrados.length !== operacion.datosIni.length){
        operacion.datosIni = objetosFiltrados;
        response.status(200).send("OK");
    }else{
        response.status(404).send("NOT FOUND");
    }
};

//Borrar todos los que contengan un determinado valor del campo
const borrarValorCampo = (request, response) => {
    const campo = request.params.campo; 
    const valor = request.params.valor;
    const objetosFiltrados = operacion.datosIni.filter(objeto => !(objeto[campo] === valor));
    if (objetosFiltrados.length !== operacion.datosIni.length) {
        operacion.datosIni =  objetosFiltrados;
        response.status(200).send("OK");
    }
    response.status(404).send("NOT FOUND");

};

module.exports = {
    calculoMedia,
    cargaInicial,
    cargaDatos,
    postObjeto,
    cargaValorCampo,
    cargaListCampo,
    actualizarObj,
    errActualizar,
    borrarCampo,
    borrarValorCampo,
    errPosteo,
    cargaDatosJLN
};