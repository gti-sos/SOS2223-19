var express = require("express");
var bodyParser = require("body-parser");

var arrayBRB = require('./index-BRB');

var app = express();

var datastoreBRB = require('nedb');
var ddbb = new datastoreBRB();
ddbb.insert(arrayBRB.datosInicialesBruno);

app.use(bodyParser.json());

const BASE_API_URL = "/api/v1";
const BRB_URL = BASE_API_URL + "/occupancy-of-accomodation-in-rural-tourism";

module.exports = (app) => {
    //-----------------------------------------gets-------------------------------------------------------------
    app.get(BRB_URL+"/docs",(req,res)=>{
        res.redirect("https://documenter.getpostman.com/view/25989970/2s93RNyEu7");
    })


    app.get(BRB_URL + '', (request, response) => {
        const query = request.query;

        if (Object.keys(query).length === 0) {
            // Obtener todos los datos
            console.log("New request to /occupation-stats");
            ddbb.find({}, (err, arrayDatos) => {
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

                ddbb.find({}, (err, docs) => {
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
            const traveller = parseFloat(query.traveller);
            const overnight_stay = parseFloat(query.overnight_stay);
            const average_stay = parseFloat(query.average_stay);

            if (province && month) {
                console.log(`New request to /occupation-stats?province="${province}"&month="${month}"`);
                ddbb.findOne({ province: province, month: month }, (err, array) => {
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
            } else if (province) {
                console.log(`New request to /occupation-stats?province="${province}"`);
                ddbb.find({ province: province }, (err, array) => {
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
                ddbb.find({ month: month }, (err, array) => {
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
                ddbb.find({ [campo]: { $exists: true } }, { [campo]: 1, _id: 0 }, (err, docs) => {
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
            } else if (traveller) {
                console.log(`New request to /occupation-stats?traveler="${traveler}"`);
                ddbb.find({ traveler: traveller }, (err, array) => {
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
                ddbb.find({ overnight_stay: overnight_stay }, (err, array) => {
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
                ddbb.find({ average_stay: average_stay}, (err, array) => {
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

    
    app.get(BRB_URL + "/loadInitialData", (request, response) => {
        ddbb.find({}, (err, dato) => {
            if (err) {
                console.log(`error geting /occupancy: ${err}`);
                response.sendStatus(500);
            } else if (dato.length === 0) {
                for (var i = 0; i < arrayBRB.datosInicialesBruno.length; i++) {
                    ddbb.insert(arrayBRB.datosInicialesBruno[i]);
                }
                response.sendStatus(201);
                console.log("se han cargado los datos iniciales");
            } else {
                response.status(409).send("ya existen los datos");
                console.log(`existen ${dato.length} datos`);
            }
        }
        );
    });

    app.get(BRB_URL+"/:province", (request, response) => {
        var provincia = request.params.province
        console.log(`nuevo get a ${provincia}`);
        ddbb.find({province: provincia}, (err, dato) => {
            if (err) {
                console.log(`error geting /occupancy: ${err}`);
                response.sendStatus(500);
            }else if (dato.length === 0) {
                console.log(`error geting /occupancy: element not found`);
                response.sendStatus(404);
            } else {
                response.status(200).json(dato.map((c) => {
                    delete c._id;
                    return c;
                }));
            }
        });
    });

    app.get(BRB_URL+"/:province/:month", (request, response) => {
        var provincia = request.params.province;
        var mes = request.params.month;
        console.log(`nuevo get a ${provincia} ${mes}`);
        ddbb.find({ province: provincia, month: mes }, (err, dato) => {
            if (err) {
                console.log(`error geting /occupancy: ${err}`);
                response.sendStatus(500);
            } else {
                delete dato[0]._id;
                response.status(200).send(JSON.stringify(dato[0], null, 2));;
            }
        });
    });


    //-------------------------------------POSTS----------------------------------------------------------
    const camposObligatoriosBRB = ["province", "month", "traveller", "overnight_stay", "average_stay"];
    app.post(BRB_URL, (request, response) => {
        var nuevo = request.body;
        ddbb.find({ province: nuevo.province, month: nuevo.month }, (err, dato) => {
            if (err) {
                console.log(`error posting /occupancy: ${err}`);
                response.sendStatus(500);
            } else if (dato.length > 0) {
                response.status(409).send('CONFLICT, el objeto ya existe en la base de datos');
                console.log('409');
            } else if (camposObligatoriosBRB.find((n) => !nuevo[n])) {
                response.status(400).send('BAD REQUEST, faltan campos requeridos en el objeto');
                console.log('400');
            } else {
                ddbb.insert(nuevo);
                console.log('New POST to /occupation-stats');
                response.status(201).send("created");
            }
        });
    });

    app.post(BRB_URL + "/:campo", (req, res) => {
        res.status(405).send('Method not Allowed');
        console.log(`Error 405 Method not Allowed`);
    });

    //----------------------------------------------------------PUTS----------------------------------------
    app.put(BRB_URL, (req, res) => {
        res.status(405).send('Method not Allowed');
        console.log(`Error 405 Method not Allowed`);
    });

    app.put(BRB_URL + "/:province/:month", (req, res) => {
        var provincia = req.params.province;
        var mes = req.params.month;
        var nuevo = req.body;
        console.log(nuevo);
        ddbb.find({ province: provincia, month: mes }, (err, dato) => {
            if (err) {
                console.log(`error posting /occupancy: ${err}`);
                res.sendStatus(500);
            } else if (dato.length === 0) {
                console.log(dato);
                res.status(404).send(`No se encontraron datos con el campo ${provincia}`);
            } else if (camposObligatoriosBRB.find((n) => !nuevo[n])) {
                res.status(400).send('BAD REQUEST, faltan campos requeridos en el objeto');
                console.log('400');
            } else {
                ddbb.update({ province: provincia, month: mes }, nuevo, err => {
                    if (err) {
                        console.log(`error posting /occupancy: ${err}`);
                        res.status(500).send("Inernal error");
                    } else {
                        console.log(`New PUT to /${provincia}/${mes}`);
                        res.status(200).send('ok');
                    }
                });
            }
        });
    });

    app.delete(BRB_URL, (request, response)=>{
        ddbb.remove({},{multi:true},(err,numRemoved)=>{
            if(err){
                console.log(`Error deleting: ${err}`);
                response.sendStatus(500);
            }else{
                if(numRemoved==0){
                    response.sendStatus(404).send("HTTP 404 NOT FOUND");
                }else{
                    console.log(`Files removed ${numRemoved}`);
                    response.sendStatus(200);
                }    
            }
        });
    });

    app.delete(BRB_URL+"/:province/:month", (req,res) => {
        var provincia = req.params.province;
        var month = req.params.month;

        console.log(`New DELETE to /provincia/${provincia} ${month} `);

        ddbb.remove({province: provincia, month: month}, {multi:true}, (err,numRemoved)=>{
            if(err){
                console.log(`Error deleting /${provincia}: ${err}`);
                res.status(500).send("Internal server error");
            }else{
                if (numRemoved==0){
                    res.status(404).send("not found");
                }else{
                    console.log(`Self-employed removed: ${numRemoved}`);
                    res.status(200).send("ok");
                }
            }
        });
    });

    app.delete(BRB_URL+"/:province", (req,res) => {
        var provincia = req.params.province;
       
        console.log(`New DELETE to /provincia/${provincia} `);

        ddbb.remove({province: provincia}, {multi:true}, (err,numRemoved)=>{
            if(err){
                console.log(`Error deleting /${provincia}: ${err}`);
                res.status(500).send("Internal server error");
            }else{
                if (numRemoved==0){
                    res.status(404).send("not found");
                }else{
                    console.log(`Self-employed removed: ${numRemoved}`);
                    res.status(200).send("ok");
                }
            }
        });
    });

}