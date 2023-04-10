<script lang="ts">

  // @ts-nocheck
  import { onMount } from 'svelte';
  import { dev } from '$app/environment';
  import { Button, Table, Alert } from 'sveltestrap';
  
  onMount(async () => {
    await getOccupationStats();
  });

  let API = '/api/v2/occupation-stats';
  
  if (dev) API = 'http://localhost:12345'+API;
  
  let Datos = [];
  let newDatosProvince = 'province';
  let newDatosMonth = 'month';
  let newDatosTrav = 'traveler';
  let newDatosOS = 'overnight_stay';
  let newDatosAS= 'average_stay';


  let result = "";
  let resultStatus = "";
  
  let message = "";
  let c = "";

  async function getOccupationStats() {
    resultStatus = result = "";
    const res = await fetch(API, {
      method: 'GET'
    });
    try {
      const data = await res.json();
      result = JSON.stringify(data, null, 2);
      Datos = data;
    } catch (error) {
      console.log(`Error parsing result: ${error}`);
    }
    const status = await res.status;
    resultStatus = status;  
  }

  async function createOcuppationStats() {
    resultStatus = result = "";
    const res = await fetch(API, {
      method: 'POST',
      headers:{
        "Content-Type" : "application/json"
      },
      body:JSON.stringify({
        province: newDatosProvince,
        month: newDatosMonth,
        traveler: newDatosTrav,
        overnight_stay: newDatosOS,
        average_stay: newDatosAS
      })
    });    
    
    const status = await res.status;
    resultStatus = status;
    if (status==201) {
      getOccupationStats();
    }else if(status==409){
      message="Error 409, Conflicto, el elemento ya existe"
      c="warning";
    }else if(status==400){
      message="Error 400, Bad Request, rellena todos los campos"
      c="warning";
    }else if(status == 500){
      message="Error 500, Internal Error"
      c="danger";
    }
  }

  async function deleteOcuppationStats(province,month) {
    resultStatus = result = "";
    const res = await fetch(API+"/"+province+"/"+month, {
      method: 'DELETE'
    });    
    
    const status = await res.status;
    resultStatus = status;
    if(status==200){
      getOccupationStats();
      message = "Elemento borrado";
      c = "success";
    } 
  }

  async function deleteAllOcuppationStats() {
    resultStatus = result = "";
    const res = await fetch(API, {
      method: 'DELETE'
    });    
    
    const status = await res.status;
    resultStatus = status;
    if (status==200) {
      location.reload();
      window.alert("ESTAS SEGURO?");
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
      <th>Province</th>
      <th>Month</th>
      <th>Travelers</th>
      <th>Overnight_stay</th>
      <th>Average_stay</th>
      <td>
        <Button on:click={deleteAllOcuppationStats}>Borrar todo</Button>
      </td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><input bind:value={newDatosProvince}></td>
      <td><input bind:value={newDatosMonth}></td>
      <td><input bind:value={newDatosTrav}></td>
      <td><input bind:value={newDatosOS}></td>
      <td><input bind:value={newDatosAS}></td>
      <td>
        <Button on:click={createOcuppationStats}>Añadir</Button>
      </td>
    </tr>
    {#each Datos as r}
      <tr>
        <td><a href="/occupation-stats/{r.province}/{r.month}">{r.province}</a></td>
        <td>{r.month}</td>
        <td>{r.traveler}</td>
        <td>{r.overnight_stay}</td>
        <td>{r.average_stay}</td>
        <Button on:click={deleteOcuppationStats(r.province,r.month)}> Borrar</Button>
      </tr>
    {/each}
  </tbody>
</Table>


