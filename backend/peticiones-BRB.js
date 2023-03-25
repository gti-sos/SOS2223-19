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

    app.get(BRB_URL, (request, response) => {
        console.log("nuevo get a /occupancy");
        ddbb.find({}, (err, dato) => {
            if (err) {
                console.log(`error geting /occupancy: ${err}`);
                response.sendStatus(500);
            } else {
                response.status(200).json(dato.map((c) => {
                    delete c._id;
                    return c;
                }));
            }
        });
    });

    app.get(BRB_URL+"/:province", (request, response) => {
        var provincia = request.params.province
        console.log(`nuevo get a ${provincia}`);
        ddbb.find({province: provincia}, (err, dato) => {
            if (err) {
                console.log(`error geting /occupancy: ${err}`);
                response.sendStatus(500);
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
                response.status(200).json(dato.map((c) => {
                    delete c._id;
                    return c;
                }));
            }
        });
    });

    app.get(BRB_URL + "/loadInitialData", (request, response) => {
        ddbb.find({}, (err, dato) => {
            if (err) {
                console.log(`error geting /occupancy: ${err}`);
                response.sendStatus(500);
            } else if (dato.length === 0) {
                for (var i; i < arrayBRB.datosBruno; i++) {
                    ddbb.insert(arrayBRB.datosBruno[i]);
                    response.sendStatus(200);
                    console.log("se han cargado los datos iniciales");
                }
            } else {
                response.status(409).send("ya existen los datos");
                console.log(`existen ${dato.length} datos`);
            }
        }
        );
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