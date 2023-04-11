<script lang="ts">

    // @ts-nocheck
    import { onMount } from 'svelte';
    import { dev } from '$app/environment';
    import { Button, Table, Alert, Icon } from 'sveltestrap';
    import { page } from '$app/stores';
    
    onMount(async () => {
      await getOccupationStat();
    });

    let province = $page.params.province;
    let month = $page.params.month;
  
    let API = '/api/v2/occupation-stats/'+province+'/'+month;
    
    if (dev) API = 'http://localhost:12345'+API;
    
    let updDatosProvince = province;
    let updDatosMonth = month;
    let updDatosTrav = '';
    let updDatosOS = '';
    let updDatosAS= '';
  
  
    let result = "";
    let resultStatus = "";

    let message = "";
    let c = "";
  
    async function getOccupationStat() {
      resultStatus = result = "";
      const res = await fetch("/api/v2/occupation-stats?province="+province+"&month="+month, {
        method: 'GET'
      });
      try {
        const data = await res.json();
        result = JSON.stringify(data, null, 2);
        updDatosProvince = data.province;
        updDatosMonth = data.month;
        updDatosTrav = data.traveler;
        updDatosOS = data.overnight_stay;
        updDatosAS = data.average_stay;

      } catch (error) {
        console.log(`Error parsing result: ${error}`);
      }
      const status = await res.status;
      resultStatus = status;  
      if (status == 500) {
        message = "Error interno";
        c = "danger";
      } else if (status==404){
        message = "Dato no encontrado";
        c = "danger";
      } else if (status==502){
        message = "Dato no encontrado";
        c = "danger";
      }
    }
  
    async function updOcuppationStats() {
      resultStatus = result = "";
      const res = await fetch(API, {
        method: 'PUT',
        headers:{
          "Content-Type" : "application/json"
        },
        body:JSON.stringify({
          province: updDatosProvince,
          month: updDatosMonth,
          traveler: updDatosTrav,
          overnight_stay: updDatosOS,
          average_stay: updDatosAS
        })
      });    
      
      const status = await res.status;
      resultStatus = status;
      if (status == 200) {
        message = "Actualizado con exito";
        c = "success";
        getOccupationStat();
        window.location.href = "/occupation-stats";
      }else if (status == 400) {
        message = "Rellena todos los campos";
        c = "warning";
      } else if (status == 500) {
        message = "Error interno";
        c = "danger";
      } 
    }  
  </script>
  
  <h1>Occupation-stats</h1>
  
  {#if message != ""}
  <Alert color={c}>{message}</Alert>
  {/if}
  
  <Table>
    <thead>
      <tr>
        <th>Provincia</th>
        <th>Mes</th>
        <th>Viajeros</th>
        <th>Estancia nocturna</th>
        <th>Media de estancias</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>{updDatosProvince}</td>
        <td>{updDatosMonth}</td>
        <td><input bind:value={updDatosTrav}></td>
        <td><input bind:value={updDatosOS}></td>
        <td><input bind:value={updDatosAS}></td>
        <td>
          <Button on:click={updOcuppationStats}>Actualizar</Button>
        </td>
      </tr>
    </tbody>
  </Table>

