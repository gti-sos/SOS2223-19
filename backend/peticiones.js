var express = require("express");
var bodyParser = require("body-parser");

var operacion = require('./index-JLN');

var app = express();

var Datastore = require('nedb');
const { json } = require("body-parser");
var db = new Datastore(); 

db.insert(operacion.arrayDatos);


app.use(bodyParser.json());

const BASE_API_URL = "/api/v1";
const JLN = BASE_API_URL + "/occupation-stats";

//index jln
const camposObligatorios = ["province","month","traveler","overnight_stay","average_stay"];

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

// const cargaDatos = (request,response)=>{
//     console.log("New request to /occupation-stats");
//     db.find({}, (err,arrayDatos)=>{
//         if(err){
//             console.log(`Error getting /occupation-stats: ${err}`);
//             response.sendStatus(500);
//         }else{
//             console.log(`Returned ${arrayDatos.length}`);
//             //response.status(200).send("OK");
//             response.json(arrayDatos.map((n)=>{
//                 delete n._id;
//                 return n;
//             }));
//         }
//     });
// };

// Tabla azul y códigos de la verde
const postObjeto = (request, response) => {
    const newData = request.body;

    if (request.originalUrl != JLN) {
        response.status(405).send('METHOD NOT ALLOWED');
        console.log('405');
    
    } else {
        if (camposObligatorios.find((n) => !newData[n])) {
            response.status(400).send('BAD REQUEST, faltan campos requeridos en el objeto');
            console.log('400');

        } else {
            db.findOne({ province: newData.province, month: newData.month }, (err, existe) => {
            
                if (err) {
                    response.status(500).send('INTERNAL SERVER ERROR');
                    console.log(err);
                } else if (existe) {
                    response.status(409).send('CONFLICT, el objeto ya existe en la base de datos');
                    console.log('409');
                } else {
                    console.log(`newData = <${JSON.stringify(newData, null, 2)}>`);
                    console.log('New POST to /occupation-stats');
                    db.insert(newData, (err, doc) => {
                        if (err) {
                            response.status(500).send('INTERNAL SERVER ERROR');
                            console.log(err);
                        } else {
                            response.status(201).send('Created');
                        }
                    });
                }
            });
        }
    }
  };

const errPosteo = (req, res) => {
    res.status(405).send('Method not Allowed');
    console.log(`Error 405 Method not Allowed`);
};
//obtener array de un valor de un campo en especifico
// const cargaValorCampo = (request,response)=>{
//     const campo = request.params.campo;
//     const valor = request.params.valor;
//     const arrayfiltrado = operacion.arrayDatos.filter(n=>n[campo] === valor);

//     if(arrayfiltrado.length === 0){
//         response.status(404).send(`No se encontraron datos con el campo "${campo}" igual a "${valor}"`);
//         console.log(404);
//     }else{
//         response.status(200).send(arrayfiltrado);
//         console.log(`New GET to /${campo}/${valor}`);
//     }
// };
const cargaValorCampo = (request, response) => {
    const province = request.query.province;
    const month = request.query.month;
    if (province && month) {
        db.findOne({province:province,month:month}, (err, array) => {
            if (err) {
                response.status(500).send('INTERNAL SERVER ERROR');
                console.log(err);
            } else if(array===0) {
                response.status(404).send(`No se encontraron datos con el campo "${province}" igual a "${month}"`);
                console.log(404);
            }else{
                response.json(array);
                console.log(`Returned ${array.length}`);
            }
        });
    } else if (province) {
         db.find({ province: province }, (err, arrayDatos) => {
             if (err) {
                response.status(500).send('INTERNAL SERVER ERROR');
                console.log(err);
            } else if (arrayDatos.length==0) {
                response.status(404).send(`No se encontraron datos con el campo province igual a "${month}"`);
                console.log(404);
            } else {
                response.send(arrayDatos);
                console.log(`Returned ${arrayDatos.length}`);    
            }
        });
    } else if (month) {
         db.find({ month: month }, (err, arrayDatos) => {
             if (err) {
                response.status(500).send('INTERNAL SERVER ERROR');
                console.log(err);
            } else if (arrayDatos.length==0) {
                response.status(404).send(`No se encontraron datos con el campo month igual a "${month}"`);
                console.log(404);
            } else {
                response.send(arrayDatos);
                console.log(`Returned ${arrayDatos.length}`);
            }
        });
    }
}

//obtener array de un campo en especifico
// const cargaListCampo = (request, response) => {
//     const campo = request.params.campo;
//     const lc = operacion.arrayDatos.filter(n => n.hasOwnProperty(campo)).map(c => c[campo]);
//     if (lc.length === 0) {   
//       response.status(404).send(`No se encontraron datos con el campo "${campo}"`);
//       console.log(404);
//     } else {
//       response.status(200).send(lc);
//       console.log(`New GET to /${campo}`);
//     }
// };

const cargaListCampo = (request, response) => {
    const campo = request.query.campo;
    db.find({[campo]: {$exists: true}}, {[campo]: 1, _id: 0}, (err, docs) => {
        if (err) {
            response.status(500).send('INTERNAL SERVER ERROR');
            console.log(err);
        } else {
            if (docs.length === 0) {
                response.status(404).send(`No se encontraron datos con el campo "${campo}"`);
                console.log(404);
            } else {
                const lc = docs.map((doc) => doc[campo]);
                response.json(lc);
                console.log(`New GET to /${campo}`);
            }
        }
    });
};

//Actualizar dato en especifico

// const actualizarObj = (request,response) => {
//     const campo = request.params.campo;
//     const dato = request.params.dato;
//     const newData = request.body;

//     const objIndex =  operacion.arrayDatos.find(n=>n.province === campo && n.month === dato);
//     if(objIndex === 0){
//         response.status(404).send(`No se encontraron datos con el campo ${campo}`);
//     }else{
//         if (camposObligatorios.find(n => !newData[n])) {
//             response.status(400).send('BAD REQUEST');
//             console.log("400");
//         }else{
//             for (let p in newData) {
//                 objIndex[p] = newData[p];
//             }
//             console.log(`New PUT to /${campo}/${dato}`);
//             response.status(200).send("OK");
//         }
//     }
// };


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
    cargaInicial,
    // cargaDatos,
    postObjeto,
    cargaValorCampo,
    cargaListCampo,
    // actualizarObj,
    errActualizar,
    borrarCampo,
    borrarValorCampo,
    errPosteo
};