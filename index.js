var express = require("express");
var cool = require("cool-ascii-faces");

var operacion = require("./index-JLN");
<<<<<<< HEAD
const { arrayDatos } = require("./index-JLN");
=======
var mediaProvincia = require("./index-BRB");
var mediaProvincia = require("./index-BRB");
>>>>>>> 322f2a83f9bb25beb20b261a4814e9fe46e9f110

var app = express();
var port = process.env.PORT || 12345;

const BASE_API_URL = "/api/v1";

<<<<<<< HEAD
//const media = require("./index-BRB")-----preguntar en clase si se puede
=======

>>>>>>> 322f2a83f9bb25beb20b261a4814e9fe46e9f110

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
app.get(BASE_API_URL+"/FFFF", (request,response)=>{
    response.json(operacion.arrayDatos);
    console.log("New request to /FFFF");
});

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

<<<<<<< HEAD
//funcion para calcular la media aritmetica mas datos del ejemplo
datosEjemplo = [
    {
        province: "Almeria",
        month: "Enero",
        traveller: 156.404958677,
        overnigth_stay: 860.227272729,
        average_stay: 5.500000000035170
    },
    {
        province: "Almeria",
        month: "Febrero",
        traveller: 59.669421489,
        overnigth_stay: 458.512396696,
        average_stay: 7.68421052616584
    },
    {
        province: "Almeria",
        month: "Marzo",
        traveller: 241.367588932,
        overnigth_stay: 851.138339921,
        average_stay: 3.5263157894856800
    },
    {
        province: "Almeria",
        month: "Abril",
        traveller: 433.249011857,
        overnigth_stay: 1290.04743083,
        average_stay: 2.9776119403032800
    },
    {
        province: "Almeria",
        month: "Mayo",
        traveller: 931.686746987,
        overnigth_stay: 2781.983935743,
        average_stay: 2.9859649122837800
    },
    {
        province: "Almeria",
        month: "Junio",
        traveller: 2182.8502994,
        overnigth_stay: 4924.562874252,
        average_stay: 2.2560240963870100
    },
    {
        province: "Almeria",
        month: "Julio",
        traveller: 3654.393063585,
        overnigth_stay: 11929.393063585,
        average_stay: 3.2643979057584300
    },
    {
        province: "Almeria",
        month: "Agosto",
        traveller: 4193.304431599,
        overnigth_stay: 15838.892100194,
        average_stay: 3.777186311787590
    },
    {
        province: "Almeria",
        month: "Septiembre",
        traveller: 2058.044444443,
        overnigth_stay: 5633.237037037,
        average_stay: 2.73717948718139 
    },
    {
        province: "Almeria",
        month: "Octubre",
        traveller: 1637.339622641,
        overnigth_stay: 4096.690566039,
        average_stay: 2.502040816328080
    },
    {
        province: "Almeria",
        month: "Novuiembre",
        traveller: 1106.229249013,
        overnigth_stay: 2592.308300394,
        average_stay: 2.3433734939723500
    },
    {
        province: "Almeria",
        month: "Diciembre",
        traveller: 1754.936507937,
        overnigth_stay: 4843.492063495,
        average_stay: 2.75992438563417
    }
];


function mediaGeografica(provincia,campo){
    suma = 0;
    //filtramos el array por provincia
    datosEjemplo.filter(function(dato) {
        return datosEjemplo.province == provincia
    })
    // seleccionamos el campo que queremos y sumamos sus componentes
    if(campo == "traveller"){
        datosEjemplo.forEach(element => {
            suma += element.traveller
        });
    }else if(campo == "average_stay"){
        datosEjemplo.forEach(element => {
            suma += element.average_stay
        });
    }else{
        datosEjemplo.forEach(element => {
            suma += element.overnigth_stay
        });
    }
    //dividimos por la longitud de la lista
    return suma/datosEjemplo.length;
}

console.log("media aritmetica de almeria y traveler: " + mediaGeografica("Almeria","traveller"))

=======
>>>>>>> 322f2a83f9bb25beb20b261a4814e9fe46e9f110
