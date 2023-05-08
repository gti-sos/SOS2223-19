<svelte:head>
    <script src="https://cdn.zingchart.com/zingchart.min.js"></script>
</svelte:head>

<script>
    //@ts-nocheck
    import { onMount } from 'svelte';

    let API = 'https://sos2223-19.appspot.com/api/v2';

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
            getDatosBRN();
        } catch (error) {
            console.log(`Error parsing result: ${error}`);
        }
        const status = await res.status;
        resultStatus = status;  
    }

    async function getDatosBRN() {
        resultStatus = result = "";
        const res = await fetch(API + '/occupancy-of-accomodation-in-rural-tourism' , {
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
        zingchart.render({
        id: 'mi-grafica',
        data: {
            type: 'bar',
            title: {
                text: 'Media de ocupacion en alojamientos rurales y en campings'
            },
            scaleX: {
                labels: dat.map(d => d.province + ' ' + d.month)
            },
            series: [
                {
                    values: dat.map(d => d.average_stay),
                    lineColor: '#FF5733', // Color de línea para la primera lista
                    text: 'Media de ocupacion en campings'
                },
                {
                    values: dat1.map(d => d.average_stay),
                    lineColor: '#33FFB0', // Color de línea para la segunda lista
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
        margin: 50px auto;
        padding-top: 50px;
    }
</style>

<div id="mi-grafica"></div>