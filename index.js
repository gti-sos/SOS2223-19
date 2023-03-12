var express = require("express");
var cool = require("cool-ascii-faces");
var bodyParser = require("body-parser");

var operacion = require("./modularizadoJLN/index-JLN");
var mediaProvincia = require("./index-BRB");
var mediaProvincia = require("./index-BRB");

var app = express();
var port = process.env.PORT || 12345;
app.use(bodyParser.json());

const BASE_API_URL = "/api/v1";


//cool asci faces
app.get("/cool",(req,res) =>{ //request,response
    res.send(cool());
    console.log("->  New cool face request  <-");
});

//index brb
app.get("/samples/BRB",(req,res) =>{
    var media = mediaProvincia.mediaGeografica("Almeria","traveller");
    res.send(`la media de viajeros en almeria es: ${media}`);
    console.log("->  media aritmetica almeria traveller  <-");
});

/*---------------------------------------JLN-----------------------------------------------------------------------------*/
//index jln
app.get("/samples/JLN",(req,res) =>{
    pr = "Almeria";
    c = "traveler";
    var media = operacion.avgDatos(operacion.arrayDatos,pr, c);
    res.send("La media de " + c + " en " + pr + " es de " + media + " " + c + "s.");
    console.log(`->  media aritmetica  ${pr} ${c} calculada  <-`);
});

var datosJLN = [];

app.get(BASE_API_URL+"/occupation-stats/loadInitialData", (request, response) => {
  if (datosJLN.length === 0) {
    datosJLN.push(operacion.datosIni);
    response.json(datosJLN);
    console.log("Carga de datos iniciales realizada");
    response.sendStatus(201);
  } else {
    response.status(409).send("El array ya tiene datos");
    console.log("El array ya tiene datos, tiene " + datosJLN.length);
    console.log(409);
  }
});
/*
var datosJLN = [];
app.get(BASE_API_URL+"/occupation-stats/loadInitialData", (request,response)=>{
    if (datosJLN.length==0){
        datosJLN.push(operacion.datosIni);
        response.json(datosJLN);
        console.log("Carga de datos iniciales realizada");
        response.sendStatus(201);
    }else{
        response.status(409).send("El array ya tiene datos");
        console.log("El array ya tiene datos, tiene " + datosJLN.length);
        console.log(409);
    }
});*/

app.get(BASE_API_URL+"/occupation-stats", (request,response)=>{
    response.json(operacion.arrayDatos);
    console.log("New request to /occupation-stats");
    response.sendStatus(200);
});

// Tabla azul y códigos de la verde
const JLN = BASE_API_URL+"/occupation-stats";
app.post(JLN,(request,response)=>{
    const newData = request.body;
    if (request.originalUrl!=JLN){
        response.status(405).send("Metodo no permitido");
        console.log("405");
    }else{
        if (!newData.province||!newData.month||!newData.traveler||!newData.overnight_stay||!newData.average_stay) {
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
                operacion.arrayDatos.push(newData);
                response.sendStatus(201);
            }
        }
    }
});

//obtener array de un valor de un campo en especifico
app.get(JLN+"/:campo/:valor",(request,response)=>{
    const campo = request.params.campo;
    const valor = request.params.valor;
    const arrayfiltrado = operacion.arrayDatos.filter(n=>n[campo] === valor);

    if(arrayfiltrado.length === 0){
        response.status(404).send(`No se encontraron datos con el campo "${campo}" igual a "${valor}"`);
        console.log(404);
    }else{
        response.send(arrayfiltrado);
        console.log(`New GET to /${campo}/${valor}`);
        response.sendStatus(200);
    }
});

//obtener array de un campo en especifico
app.get(JLN + '/:campo', (request, response) => {
    const campo = request.params.campo;
    const lc = operacion.arrayDatos.filter(n => n.hasOwnProperty(campo)).map(c => c[campo]);
    if (lc.length === 0) {   
      response.status(404).send(`No se encontraron datos con el campo "${campo}"`);
      console.log(404);
    } else {
      response.send(lc);
      console.log(`New GET to /${campo}`);
    }
});

//Actualizar dato en especifico
app.put(JLN + `/:campo/:dato`,(request,response) => {
    const campo = request.params.campo;
    const dato = request.params.dato;
    const valoresNuevos = request.body;

    const objIndex =  operacion.arrayDatos.find(n=>n.province === campo && n.month === dato);
    if(objIndex === 0){
        response.status(404).send(`No se encontraron datos con el campo ${campo}`);
    }else{
        if (!valoresNuevos.province||!valoresNuevos.month||!valoresNuevos.traveler||!valoresNuevos.overnight_stay||!valoresNuevos.average_stay) {
            response.status(400).send('Faltan campos requeridos en el objeto');
            console.log("400");
        }else{
            for (let p in valoresNuevos) {
                objIndex[p] = valoresNuevos[p];
            }
            response.send("Objeto actualizado correctamente");
            console.log(`New PUT to /${campo}/${dato}`);
            response.status(200).send("OK");
        }
    }
}); 

app.put(JLN, (req, res) => {
    res.status(405).send('Method not Allowed');
    console.log(`Error 405 Method not Allowed`);

});
//Borrar un determinado campo
app.delete(JLN + '/:campo', (request, response) => {
    const campo = request.params.campo; 
    const objetosFiltrados = datosJLN.filter(objeto => objeto.hasOwnProperty(campo));
    
    if (objetosFiltrados.length === 0) {
      response.status(404).send("No se encontraron objetos con ese campo");
    }
    datosJLN = datosJLN.filter(objeto => !objeto.hasOwnProperty(campo));
    
    response.status(200).send("Los objetos han sido eliminados exitosamente");
  });

//Borrar todos los que contengan un determinado valor del campo
app.delete(JLN + '/:campo/:valor', (request, response) => {
    const campo = request.params.campo; 
    const valor = request.params.valor;

    const objetosFiltrados = datosJLN.filter(objeto => objeto.hasOwnProperty(campo)&& objeto[campo] === valor);
    
    if (objetosFiltrados.length === 0) {
      response.status(404).send("No se encontraron objetos con ese campo");
    }
    datosJLN = datosJLN.filter(objeto => !objeto.hasOwnProperty(campo)|| objeto[campo] !== valor);
    
    response.status(200).send("Los objetos han sido eliminados exitosamente");

});
/*---------------------------------------JLN-----------------------------------------------------------------------------*/
//escuchar el puerto
app.listen(port,()=>{
    console.log(`Server ready in port ${port}`);
});

