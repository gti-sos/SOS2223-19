<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/series-label.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

<script>
    //@ts-nocheck
    import { onMount } from 'svelte';
    import { dev } from '$app/environment';

    let API = '/api/v2/occupation-stats';
  
    if (dev) API = 'http://localhost:12345'+API;

    let datos= [];
    let result = "";
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

    async function getOccupationStats2() {
        resultStatus = result = "";
        const res = await fetch(API, {
            method: 'GET'
        });
        try {
            const data = await res.json();
            result = JSON.stringify(data, null, 2);
            datos= data;
            datos.sort((a, b) => monthOrder[a.month] - monthOrder[b.month]);
            loadChart(datos);
        } catch (error) {
            console.log(`Error parsing result: ${error}`);
        }
        const status = await res.status;
        resultStatus = status;  
    }

    async function loadChart(graphData){

        Highcharts.chart('container', {
            chart: {
                type: 'area'
            },
            title: {
                text: 'Estadisticas de ocupación',
                align: 'center'
            },
            subtitle: {
                text: 'Highcharts',
                align: 'left'
            },
            subtitle: {
                text: 'Source: <a ' +
                    'href="https://www.ssb.no/energi-og-industri/energi/statistikk/elektrisitet/artikler/lavere-kraftproduksjon"' +
                    ' target="_blank">SSB</a>',
                align: 'left'
            },
            xAxis: {
                categories: graphData.map(entry => entry.province + ' ' + entry.month)
            },
            yAxis: {
                title: {
                    text: 'Total'
                }
            },
            credits: {
                enabled: false
            },
            series: [{
                name: 'Viajeros',
                data: graphData.map(entry => entry.traveler)
            }, {
                name: 'Pernoctación',
                data: graphData.map(entry => entry.overnight_stay)
            }, {
                name: 'Media de estancias',
                data: graphData.map(entry => entry.average_stay)
            }]
        });
    }

    onMount(async () => {
        await getOccupationStats2();
    });
   
</script>

<main>
    <h1>GRAPH</h1>
    <figure class="highcharts-figure">
        <div id="container"></div>
        <p class="highcharts-description">
        </p>
    </figure>
</main>