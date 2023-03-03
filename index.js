var express = require("express");
var cool = require("cool-ascii-faces");

var app = express();
var port = process.env.PORT || 12345;

//cool asci faces
app.get("/faces",(req,res) =>{ //request,response
    res.send(cool());
    console.log("->  New cool face request  <-");
});

//index brb
app.get("/samples/BRB",(req,res) =>{ //request,response
    res.send(mediaGeografica("Almeria", "traveller"));
    console.log("->  media aritmetica almeria traveller  <-");
});

app.listen(port,()=>{
    console.log(`Server ready in port ${port}`);
});