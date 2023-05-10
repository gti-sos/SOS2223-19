<svelte:head>
    <script src="https://cdn.zingchart.com/zingchart.min.js"></script>
</svelte:head>

<script>
    //@ts-nocheck
    import { onMount } from 'svelte';
    import { dev } from '$app/environment';

    let API = '/api/v2/occupation-stats';
    let API1 = 'https://sos2223-19.appspot.com/apt-occ';	

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
        const res = await fetch(API, {
            method: 'GET'
        });
        try {
            const data = await res.json();
            result = JSON.stringify(data, null, 2);
            datos= data;
            datos.sort((a, b) => monthOrder[a.month] - monthOrder[b.month]);
            getDatosCris();
        } catch (error) {
            console.log(`Error parsing result: ${error}`);
        }
        const status = await res.status;
        resultStatus = status;  
    }

    async function getDatosCris() {
        resultStatus = result = "";
        const res = await fetch(API1, {
            method: 'GET'
        });
        try {

            const data = await res.json();
            result1 = JSON.stringify(data, null, 2);
            datos1 = data;
            loadChart(datos,datos1);

        } catch (error) {
            console.log(`Error parsing result: ${error}`);
        }
        const status = await res.status;
        resultStatus = status;  
    }

    function loadChart(dat,dat1) {

        const datoConcreto = dat1.find(d => d.province === "Almería" && d.year === 2022);

        zingchart.render({
        id: 'mi-grafica',
        data: {
            type: 'mixed',
            plot: {
                clustered: true,
                margin: 'dynamic'
            },
            title: {
                text: 'Comparacion de datos de Almeria en 2022 general y durante los meses'
            },
            scaleX: {
                labels: ['Media de ocupacion en campings durante los meses', 'Media de ocupacion en alojamientos rurales en Almería en 2022'],
                item: {
                    autoAlign: true
                }
            },
            series: [
                {
                    type: 'line',
                    values: dat.map(d => d.traveler),
                    lineColor: '#FF5733'
                },
                {
                    type: 'bar',
                    values: [datoConcreto.traveler],
                    backgroundColor: '#33FFB0'
                }
            ],
            plotarea: {
                margin: 'dynamic' 
            },
        }

        });
    }

    onMount(async() => {
        await getDatosJLN();
    });
</script>

<style>
    #mi-grafica {
        margin: 50px 400px; 
        padding-top: 40px;
    }
</style>

<div id="mi-grafica"></div>