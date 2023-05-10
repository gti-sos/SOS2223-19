<svelte:head>
    <script src="https://cdn.zingchart.com/zingchart.min.js"></script>
</svelte:head>

<script>
    //@ts-nocheck
    import { onMount } from 'svelte';
    import { dev } from '$app/environment';

    let API = '/api/v2';
    let API1 = 'https://sos2223-14.appspot.com/api/v2/andalusia-tourism-situation-surveys';
  
    if (dev) API = 'http://localhost:12345'+API;

    let datos = [];
    let datos1 = [];
    let result = "";
    let result1 = "";
    let resultStatus = "";

    const monthOrder = {
        Enero: 0,
        Febrero: 1,
        Marzo: 2,
        Abril: 3,
        Mayo: 4,
        Junio: 5,
        Julio: 6,
        Agosto: 7,
        Septiembre: 8,
        Octubre: 9,
        Noviembre: 10,
        Diciembre: 11
    };

    async function getDatosJLN() {
        resultStatus = result = "";
        const res = await fetch(API + '/occupation-stats' , {
            method: 'GET'
        });
        try {
            const data = await res.json();
            result = JSON.stringify(data, null, 2);
            datos= data;
            datos.sort((a, b) => monthOrder[a.month] - monthOrder[b.month]);
            getDatosRebeca();
        } catch (error) {
            console.log(`Error parsing result: ${error}`);
        }
        const status = await res.status;
        resultStatus = status;  
    }

    async function getDatosRebeca() {
        resultStatus = result = "";
        const res = await fetch(API1 , {
            method: 'GET'
        });
        try {
            const data = await res.json();
            result1 = JSON.stringify(data, null, 2);
            datos1 = data;
            datos1.sort((a, b) => monthOrder[a.month] - monthOrder[b.month]);
            loadChart(datos,datos1);
        } catch (error) {
            console.log(`Error parsing result: ${error}`);
        }
        const status = await res.status;
        resultStatus = status;  
    }

    function loadChart(dat,dat1) {
        
        const datosConcretos = [];

        for (let i = 0; i < 12; i++) {
            const datoConcreto = dat1[i];
            datosConcretos.push(datoConcreto);
        }

        zingchart.render({
            id: 'mi-grafica',
            data: {
                type: 'area',
                title: {
                    text: 'Estadisticas de ocupacion en campings y encuesta de coyuntura turistica en Almería'
                },
                scaleX: {
                    labels: dat.map(d => d.province + ' ' + d.month)
                },
                series: [
                    {
                        values: dat.map(d => d.average_stay),
                        lineColor: '#FF5733', 
                        text: 'Media de ocupacion en campings'
                    },
                    {
                        values: datosConcretos.map(d => d.average_stay),
                        lineColor: '#33FFB0',
                        text: 'Media de ocupacion en alojamientos rurales'
                    }
                ],
                legend: {
                    alpha: 1,
                    borderColor: '#CCCCCC',
                    marginRight: '50px',
                    marginTop: '55px',
                    shadow: false,
                    toggleAction: 'remove',
                }
            }
        });
    }

    onMount(async () => {
        await getDatosJLN();
    });

</script>

<style>
    #mi-grafica {
        margin: 50px 400px;
        padding-top: 50px;
    }
</style>

<div id="mi-grafica"></div>