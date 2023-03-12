var express = require("express");
var cool = require("cool-ascii-faces");
var bodyParser = require("body-parser");

var mediaProvincia = require("./index-BRB");
var mediaProvincia = require("./index-BRB");

var app = express();
var port = process.env.PORT || 12345;
app.use(bodyParser.json());

const router = require("./modularizadoJLN/rutas");

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
app.use("",router);
/*---------------------------------------JLN-----------------------------------------------------------------------------*/
//escuchar el puerto
app.listen(port,()=>{
    console.log(`Server ready in port ${port}`);
});
