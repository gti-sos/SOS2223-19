var express = require("express");
var cool = require("cool-ascii-faces");
var operacion = require("./index-JLN");
var mediaProvincia = require("./index-BRB");

var app = express();
var port = process.env.PORT || 12345;

var mediaProvincia = require("./index-BRB");

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

//index jln
app.get("/samples/JLN",(req,res) =>{
    pr = "Almeria";
    c = "traveler";
    var media = operacion.avgDatos(operacion.arrayDatos,pr, c);
    res.send("La media de " + c + " en " + pr + " es de " + media + " " + c + "s.");
    console.log(`->  media aritmetica  ${pr} ${c} calculada  <-`);
});

//escuchar el puerto
app.listen(port,()=>{
    console.log(`Server ready in port ${port}`);
});

