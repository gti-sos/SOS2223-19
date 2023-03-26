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

module.exports = (app) => {
    //index jln
    const camposObligatorios = ["province","month","traveler","overnight_stay","average_stay"];

    // Tabla azul y códigos de la verde
    app.post(JLN, (request, response) => {
        const newData = request.body;

        if (request.originalUrl !== JLN) {
            response.status(405).send('METHOD NOT ALLOWED');
            console.log('405');
        
        } else {
            if (camposObligatorios.find((n) => !newData[n])) {
                response.status(400).send('BAD request, faltan campos requestueridos en el objeto');
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
    });


    //obtener array de un valor de un campo en especifico
    app.get(JLN + '', (request, response) => {
        const query = request.query;

        if (Object.keys(query).length === 0) {
            // Obtener todos los datos
            console.log("New request to /occupation-stats");
            db.find({}, (err, arrayDatos) => {
                if (err) {
                    console.log(`Error getting /occupation-stats: ${err}`);
                    response.status(500).send({ error: "Error interno del servidor" });
                } else {
                    console.log(`Returned ${arrayDatos.length}`);
                    const datosSinId = arrayDatos.map((n) => {
                        delete n._id;
                        return n;
                    });
                    response.status(200).json(datosSinId);
                }
            });
        } else if(request.query.offset || request.query.limit){
            const { offset, limit } = request.query;
            console.log(`New request to /occupation-stats?offset="${offset}"&limit="${limit}"`);
            if (!offset || !limit) {
                return response.status(400).send('faltan parametros requestueridos');
            } else {
                const startIndex = parseInt(offset);
                const endIndex = parseInt(offset) + parseInt(limit);

                db.find({}, (err, docs) => {
                    if (err) {
                        response.status(500).send('Error retrieving data from database');
                    } else if(offset < 0 || offset > limit || offset > docs.length || limit < 0 || limit > docs.length || endIndex > docs.length){
                        response.status(400).send('Bad request');
                    } else {
                        const data = docs.slice(startIndex,endIndex);
                        response.send(data);
                    }
                });
            }
        } else {
            // Obtener datos filtrados
            const province = query.province;
            const month = query.month;
            const campo = query.campo;
            const traveler = query.traveler;
            const overnight_stay = query.overnight_stay;
            const average_stay = query.average_stay;

            if (province && month) {
                console.log(`New request to /occupation-stats?province="${province}"&month="${month}"`);
                db.findOne({ province: province, month: month }, (err, array) => {
                    if (err) {
                        response.status(500).send("INTERNAL SERVER ERROR");
                        console.log(err);
                    } else if (array === null) {
                        response
                            .status(404)
                            .send(
                            `No se encontraron datos con el campo "${province}" igual a "${month}"`
                        );
                        console.log(404);
                    } else {
                        response.send(array);
                        console.log(`Returned ${array.length}`);
                    }
                });
            } else if (province) {
                console.log(`New request to /occupation-stats?province="${province}"`);
                db.find({ province: province }, (err, array) => {
                    if (err) {
                        response.status(500).send("INTERNAL SERVER ERROR");
                        console.log(err);
                    } else if (array === null) {
                        response
                            .status(404)
                            .send(`No se encontraron datos con el campo province igual a "${province}"`);
                        console.log(404);
                    } else {
                        response.send(array);
                        console.log(`Returned ${array.length}`);
                    }
                });
            } else if (month) {
                console.log(`New request to /occupation-stats?month="${month}"`);
                db.find({ month: month }, (err, array) => {
                    if (err) {
                        response.status(500).send("INTERNAL SERVER ERROR");
                        console.log(err);
                    } else if (array === null) {
                        response
                            .status(404)
                            .send(`No se encontraron datos con el campo month igual a "${month}"`);
                        console.log(404);
                    } else {
                        response.send(array);
                        console.log(`Returned ${array.length}`);
                    }
                });
            } else if (campo){
                console.log(`New request to /occupation-stats?campo="${campo}"`);
                db.find({ [campo]: { $exists: true } }, { [campo]: 1, _id: 0 }, (err, docs) => {
                    if (err) {
                        response.status(500).send('Error interno del servidor');
                        console.log(err);
                    } else {
                        if (docs.length === 0) {
                            response.status(404).send(`No se encontraron datos con el campo "${campo}"`);
                        } else {
                            const lc = docs.map((doc) => doc[campo]);
                            response.send(lc);
                        }
                    }
                });
            } else if (traveler) {
                console.log(`New request to /occupation-stats?traveler="${traveler}"`);
                db.find({ traveler: traveler }, (err, array) => {
                    if (err) {
                        response.status(500).send("INTERNAL SERVER ERROR");
                        console.log(err);
                    } else if (array === null) {
                        response
                            .status(404)
                            .send(`No se encontraron datos con el campo traveler igual a "${traveler}"`);
                        console.log(404);
                    } else {
                        response.send(array);
                        console.log(`Returned ${array.length}`);
                    }
                });
            } else if (overnight_stay) {
                console.log(`New request to /occupation-stats?overnight_stay="${overnight_stay}"`);
                db.find({ overnight_stay: overnight_stay }, (err, array) => {
                    if (err) {
                        response.status(500).send("INTERNAL SERVER ERROR");
                        console.log(err);
                    } else if (array === null) {
                        response
                            .status(404)
                            .send(`No se encontraron datos con el campo overnight_stay igual a "${overnight_stay}"`);
                        console.log(404);
                    } else {
                        response.send(array);
                        console.log(`Returned ${array.length}`);
                    }
                });
            } else if (average_stay) {
                console.log(`New request to /occupation-stats?average_stay="${average_stay}"`);
                db.find({ average_stay: average_stay}, (err, array) => {
                    if (err) {
                        response.status(500).send("INTERNAL SERVER ERROR");
                        console.log(err);
                    } else if (array === null) {
                        response
                            .status(404)
                            .send(`No se encontraron datos con el campo average_stay igual a "${average_stay}"`);
                        console.log(404);
                    } else {
                        response.send(array);
                        console.log(`Returned ${array.length}`);
                    }
                });
            }
        }
    });


    //Actualizar dato en especifico
    app.put(JLN, (request, response) => {
        const { province, month } = request.query;
        const newData = request.body;
        if (Object.keys(newData).length === 0) {
            response.status(400).send('BAD request');
            console.log(`400: BAD request`);
            return;
        }
        db.update({ province, month }, { $set: newData }, {}, (err, numUpdated) => {
            if (err) {
                response.status(500).send(err.message);
                console.log(`500: ${err.message}`);
                return;
            }
            if (numUpdated === 0) {
                response.status(404).send(`No se encontraron datos con la provincia ${province} y el mes ${month}`);
                console.log(`404: No se encontraron datos con la provincia ${province} y el mes ${month}`);
                return;
            }
            console.log(`New PUT to ${JLN}?province=${province}&month=${month}`);
            response.status(200).send('OK');
        });
    });

    app.put(JLN,(request, response) => {
        response.status(405).send('METHOD NOT ALLOWED');
        console.log(`Method not Allowed`);
    });

    //Borrar un determinado dato
    app.delete(JLN+ '/:province/:month', (request, response) => {
        const province = request.params.province;
        const month = request.params.month;

        console.log(`New DELETE to /occupation-stats/${province}/${month}`);

        db.remove({province:province, month:month},{multi:true},function (err, dbRemoved){
            if(err){
                console.log(`Error deleting eliminando para la provincia ${province} y el mes ${month}`);
                response.sendStatus(500);
            }else{
                if(dbRemoved==0){
                    response.status(404).send(`404: No se encontraron datos con la provincia ${province} y el mes ${month}`);
                }
                else{
                    console.log(`Files removed ${dbRemoved}`);
                    response.sendStatus(200);
                }               
            }
        });
    });

    //Borrar todos
    app.delete(JLN,(request, response)=>{
        db.remove({}, {multi:true},function (err, dbRemoved){
            if(err){
                console.log(`Error eliminando:  ${err}`);
                response.sendStatus(500);
            }else{
                if(dbRemoved==0){
                    response.status(404).send("404: No se encontraron datos");
                }
                else{
                    console.log(`Files removed ${dbRemoved}`);
                    response.sendStatus(200);
                }               
            }
        });
    });

    app.get(JLN+'/loadInitialData', (req, res) => {
        if (operacion.arrayDatos.length === 0) {
            db.insert(operacion.datosIni, (err, newDocs) => {
                if (err) {
                    res.status(500).send(err.message);
                    console.log(`500: ${err.message}`);
                    return;
                }
                console.log(`Carga de datos iniciales realizada. Se insertaron ${newDocs.length} documentos`);
                res.status(201).send(`Se insertaron ${newDocs.length} documentos`);
            });
        } else {
            res.status(409).send('CONFLICT, el array ya tiene datos');
            console.log(`El array ya tiene datos, tiene ${operacion.arrayDatos.length}`);
        }
    });

    app.get(JLN+'/docs', (request,response) => {
        response.redirect("https://documenter.getpostman.com/view/25975387/2s93RNwtfj");
    });
};