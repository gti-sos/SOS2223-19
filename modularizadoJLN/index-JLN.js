var datosEjemplo = [
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

function avgDatos(array,provincia, campo) {
    
    //acumulador
    let suma = 0;
    //array de objetos filtrados por provincia
    const objfiltro = array.filter(n => n.province === provincia);
    //agrupo solo los del campo especificado y los sumo todos
    objfiltro.map(n=>n[campo]).forEach(v => {
        suma+=v;
    });
    //devuelvo la media
    return suma/objfiltro.length;
}

pr = "Almeria";
c = "traveler";
console.log("La media de " + c + " en " + pr + " es de " + avgDatos(datosEjemplo,"Almeria","traveler") + " " + c + "s.");


datosIni=[
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

module.exports = {
    "avgDatos": avgDatos,
    "arrayDatos": datosEjemplo,
    "datosIni":datosIni
}

