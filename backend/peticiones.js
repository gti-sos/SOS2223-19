import express from "express";
import Datastore from "nedb";
var app = express();
var db = new Datastore(); 

const arrayDatos = [
    {
        province: "Almeria",
        month: "Enero",
        traveler: 1708.999999997,
        overnight_stay: 31879.000000006,
        average_stay: 18.6535985957062
    },
    {
        province: "Almeria",
        month: "Febrero",
        traveler: 1515,
        overnight_stay: 25929.000000002,
        average_stay: 17.1148514851385
    },
    {
        province: "Almeria",
        month: "Marzo",
        traveler: 3045.000000001,
        overnight_stay: 22178.999999999,
        average_stay: 7.28374384236181
    },
    {
        province: "Almeria",
        month: "Abril",
        traveler: 3992.999999999,
        overnight_stay: 22219.000000005,
        average_stay: 5.5644878537467
    },
    {
        province: "Almeria",
        month: "Mayo",
        traveler: 7320.418502197,
        overnight_stay: 25661.207048457,
        average_stay: 3.50542896430792
    },
    {
        province: "Almeria",
        month: "Junio",
        traveler: 13841.000000006,
        overnight_stay: 41900.000000002,
        average_stay: 3.02723791633436
    },
    {
        province: "Almeria",
        month: "Julio",
        traveler: 24723.999999999,
        overnight_stay: 94756.999999999,
        average_stay: 3.83259181362251
    },
    {
        province: "Almeria",
        month: "Agosto",
        traveler: 32583.999999996,
        overnight_stay: 132277.999999994,
        average_stay: 4.0595998035849
    },
    {
        province: "Almeria",
        month: "Septiembre",
        traveler: 16595.999999999,
        overnight_stay: 61046.000000001,
        average_stay: 3.67835623041725 
    },
    {
        province: "Almeria",    
        month: "Octubre",
        traveler: 13469.999999999,
        overnight_stay: 53176.999999999,
        average_stay: 3.94780994803288
    },
    {
        province: "Almeria",
        month: "Noviembre",
        traveler: 6827.000000004,
        overnight_stay: 46545.000000006,
        average_stay: 6.81778233484382
    },
    {
        province: "Almeria",
        month: "Diciembre",
        traveler: 8705.000000002,
        overnight_stay: 61774.999999997,
        average_stay: 7.09649626651152
    }
];

db.insert(arrayDatos);
app.use(express.json());

const BASE_API_URL = "/api/v2";
const JLN = BASE_API_URL + "/occupation-stats";

function loadBackendJLN(app){
    const camposObligatorios = ["province","month","traveler","overnight_stay","average_stay"];

    // Tabla azul y códigos de la verde
    app.post(JLN, (request, response) => {
        const newData = request.body;

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
    });

    app.post(JLN+'/:province', (request, response) => {
        response.status(405).send('METHOD NOT ALLOWED');
        console.log('405');
    });

    app.post(JLN+'/:province/:month', (request, response) => {
        response.status(405).send('METHOD NOT ALLOWED');
        console.log('405');
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
                    } else if(offset < 0 || offset > limit || offset > docs.length || limit < 0 || limit > docs.length){
                        response.status(400).send('Bad request');
                    } else {
                        const data = docs.slice(startIndex,endIndex);
                        data.map((n) => {
                            delete n._id;
                            return n;
                        });
                        if(data.length == 1){
                            response.send(data[0]);
                        }else{
                            response.send(data);    
                        }  
                    }
                });
            }
        } else {
            // Obtener datos filtrados
            const province = query.province;
            const month = query.month;
            const campo = query.campo;
            const traveler = parseFloat(query.traveler);
            const overnight_stay = parseFloat(query.overnight_stay);
            const average_stay = parseFloat(query.average_stay);

            if (province && month) {
                console.log(`New request to /occupation-stats?province="${province}"&month="${month}"`);
                db.findOne({ province: province, month: month },{_id: 0}, (err, array) => {
                    if (err) {
                        response.status(500).send("INTERNAL SERVER ERROR");
                        console.log(err);
                    } else if (array.length===0) {
                        response
                            .status(404)
                            .send(
                            `No se encontraron datos con el campo "${province}" igual a "${month}"`
                        );
                        console.log(404);
                    } else {
                        if(array.length == 1){
                            response.send(array[0]);
                        }else{
                            response.send(array);    
                        }
                        console.log(`Returned ${array.length}`);
                    }
                });
            } else if (province) {
                console.log(`New request to /occupation-stats?province="${province}"`);
                db.find({ province: province }, (err, array) => {
                    if (err) {
                        response.status(500).send("INTERNAL SERVER ERROR");
                        console.log(err);
                    } else if (array.length===0) {
                        response
                            .status(404)
                            .send(`No se encontraron datos con el campo province igual a "${province}"`);
                        console.log(404);
                    } else {
                        array.map((n) => {
                            delete n._id;
                            return n;
                        });
                        if(array.length == 1){
                            response.send(array[0]);
                        }else{
                            response.send(array);    
                        } 
                        console.log(`Returned ${array.length}`);
                    }
                });
            } else if (month) {
                console.log(`New request to /occupation-stats?month="${month}"`);
                db.find({ month: month }, (err, array) => {
                    if (err) {
                        response.status(500).send("INTERNAL SERVER ERROR");
                        console.log(err);
                    } else if (array.length===0) {
                        response
                            .status(404)
                            .send(`No se encontraron datos con el campo month igual a "${month}"`);
                        console.log(404);
                    } else {
                        array.map((n) => {
                            delete n._id;
                            return n;
                        }); 
                        if(array.length == 1){
                            response.send(array[0]);
                        }else{
                            response.send(array);    
                        } 
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
                            lc.map((n) => {
                                delete n._id;
                                return n;
                            });
                            if(lc.length == 1){
                                response.send(lc[0]);
                            }else{
                                response.send(lc);    
                            }
                            console.log(`Returned ${lc.length}`);
                        }
                    }
                });
            } else if (traveler) {
                console.log(`New request to /occupation-stats?traveler="${traveler}"`);
                db.find({ traveler: traveler }, (err, array) => {
                    if (err) {
                        response.status(500).send("INTERNAL SERVER ERROR");
                        console.log(err);
                    } else if (array.length===0) {
                        response
                            .status(404)
                            .send(`No se encontraron datos con el campo traveler igual a "${traveler}"`);
                        console.log(404);
                    } else {
                        array.map((n) => {
                            delete n._id;
                            return n;
                        });
                        if(array.length == 1){
                            response.send(array[0]);
                        }else{
                            response.send(array);    
                        } 
                        console.log(`Returned ${array.length}`);
                    }
                });
            } else if (overnight_stay) {
                console.log(`New request to /occupation-stats?overnight_stay="${overnight_stay}"`);
                db.find({ overnight_stay: overnight_stay }, (err, array) => {
                    if (err) {
                        response.status(500).send("INTERNAL SERVER ERROR");
                        console.log(err);
                    } else if (array.length===0) {
                        response
                            .status(404)
                            .send(`No se encontraron datos con el campo overnight_stay igual a "${overnight_stay}"`);
                        console.log(404);
                    } else {
                        array.map((n) => {
                            delete n._id;
                            return n;
                        });
                        if(array.length == 1){
                            response.send(array[0]);
                        }else{
                            response.send(array);    
                        }
                        console.log(`Returned ${array.length}`);
                    }
                });
            } else if (average_stay) {
                console.log(`New request to /occupation-stats?average_stay="${average_stay}"`);
                db.find({ average_stay: average_stay}, (err, array) => {
                    if (err) {
                        response.status(500).send("INTERNAL SERVER ERROR");
                        console.log(err);
                    } else if (array.length===0) {
                        response
                            .status(404)
                            .send(`No se encontraron datos con el campo average_stay igual a "${average_stay}"`);
                        console.log(404);
                    } else {
                        array.map((n) => {
                            delete n._id;
                            return n;
                        });
                        if(array.length == 1){
                            response.send(array[0]);
                        }else{
                            response.send(array);    
                        }
                        console.log(`Returned ${array.length}`);
                    }
                });
            }
        }
    });

    //Actualizar dato en especifico
    app.put(JLN+'/:province/:month', (request, response) => {
        const { province, month } = request.params;
        const newData = request.body;

        if(!(province && month)){
            response.status(405).send('METHOD NOT ALLOWED');
            console.log(`Method not Allowed`);
            return

        } else if (camposObligatorios.find((n) => !newData[n])) {
            response.status(400).send('BAD request, faltan campos requeridos en el objeto');
            console.log('400');
            return;
        } else {
            db.update({ province, month }, { $set: newData }, {_id: 0}, (err, numUpdated) => {
                if (err) {
                    response.status(500).send(err.message);
                    console.log(`500: ${err.message}`);
                    return;
                }
                if (numUpdated === 0) {
                    console.log(`newData = <${JSON.stringify(newData, null, 2)}>`);
                    
                    console.log(`404: No se encontraron datos con la provincia ${province} y el mes ${month}`);
                    response.status(404).send(`No se encontraron datos con la provincia ${province} y el mes ${month}`);
                    return;
                } else {
                    console.log(`New PUT to ${JLN}?province=${province}&month=${month}`);
                    response.status(200).send('OK');
                }
            });
        }
    });

    app.put(JLN, (request, response) => {
        response.status(405).send('METHOD NOT ALLOWED');
        console.log('405');
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
    app.delete(JLN, (request, response) => {
        db.remove({}, { multi: true }, function (err, dbRemoved) {
            if (err) {
                console.log(`Error eliminando:  ${err}`);
                response.sendStatus(500);
            } else {
                if (dbRemoved = 0) {
                    response.status(404).send("404: No se encontraron datos");
                } else {
                    console.log(`datos eliminados ${dbRemoved}`);
                    response.sendStatus(200);
                }
            }
        });
    });

    app.get(JLN+'/loadInitialData', (request, response) => {
        const datosIniciales = [
            {
                province: "Almeria",
                month: "Enero",
                traveler: 1708.999999997,
                overnight_stay: 31879.000000006,
                average_stay: 18.6535985957062
            },
            {
                province: "Almeria",
                month: "Febrero",
                traveler: 1515,
                overnight_stay: 25929.000000002,
                average_stay: 17.1148514851385
            },
            {
                province: "Almeria",
                month: "Marzo",
                traveler: 3045.000000001,
                overnight_stay: 22178.999999999,
                average_stay: 7.28374384236181
            },
            {
                province: "Almeria",
                month: "Abril",
                traveler: 3992.999999999,
                overnight_stay: 22219.000000005,
                average_stay: 5.5644878537467
            },
            {
                province: "Almeria",
                month: "Mayo",
                traveler: 7320.418502197,
                overnight_stay: 25661.207048457,
                average_stay: 3.50542896430792
            },
            {
                province: "Almeria",
                month: "Junio",
                traveler: 13841.000000006,
                overnight_stay: 41900.000000002,
                average_stay: 3.02723791633436
            },
            {
                province: "Almeria",
                month: "Julio",
                traveler: 24723.999999999,
                overnight_stay: 94756.999999999,
                average_stay: 3.83259181362251
            },
            {
                province: "Almeria",
                month: "Agosto",
                traveler: 32583.999999996,
                overnight_stay: 132277.999999994,
                average_stay: 4.0595998035849
            },
            {
                province: "Almeria",
                month: "Septiembre",
                traveler: 16595.999999999,
                overnight_stay: 61046.000000001,
                average_stay: 3.67835623041725 
            },
            {
                province: "Almeria",    
                month: "Octubre",
                traveler: 13469.999999999,
                overnight_stay: 53176.999999999,
                average_stay: 3.94780994803288
            },
            {
                province: "Almeria",
                month: "Noviembre",
                traveler: 6827.000000004,
                overnight_stay: 46545.000000006,
                average_stay: 6.81778233484382
            },
            {
                province: "Almeria",
                month: "Diciembre",
                traveler: 8705.000000002,
                overnight_stay: 61774.999999997,
                average_stay: 7.09649626651152
            }
        ];
        db.find({}, function(err,newData){
            if(err){
                console.log(`Error geting /apartment-occupancy-surveys/loadInitialData: ${err}`);
                response.sendStatus(500);
            }
            else{
                if(newData.length===0){
                    console.log(`data inserted: ${datosIniciales.length}`);  
                    db.insert(datosIniciales);
                    response.json(datosIniciales.map((d)=>{
                        delete d._id;
                        return d;
                    }));    
                }
                else{
                     console.log(`Data is already inserted: ${newData.length}`);
                     response.status(200).send("Data is already inserted");          
                }
            }
        });
    });

    app.get(JLN+'/docs', (request,response) => {
        response.redirect("https://documenter.getpostman.com/view/25975387/2s93RNwtfj");
    });
};

export { loadBackendJLN };