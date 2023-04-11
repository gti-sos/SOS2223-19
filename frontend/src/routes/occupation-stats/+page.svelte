<script lang="ts">

  // @ts-nocheck
  import { onMount } from 'svelte';
  import { dev } from '$app/environment';
  import { Button, Table, Alert, Icon, Toast, ToastBody, ToastHeader } from 'sveltestrap';
  
  onMount(async () => {
    await getOccupationStats();
  });

  let API = '/api/v2/occupation-stats';
  
  if (dev) API = 'http://localhost:12345'+API;
  
  let Datos = [];
  let newDatosProvince = '';
  let newDatosMonth = '';
  let newDatosTrav = '';
  let newDatosOS = '';
  let newDatosAS= '';

  const colors = [
    'primary',
    'secondary',
    'success',
    'danger',
    'warning',
    'info',
    'light',
    'dark'
  ];

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
      message="elemento creado"
      c="success";
    }else if(status==409){
      message="Conflicto, el elemento ya existe"
      c="warning";
    }else if(status==400){
      message="Rellena todos los campos"
      c="warning";
    }else if(status == 500){
      message="Internal Error"
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

<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css" rel="stylesheet">

<style>
  .table-container {
    margin-top: 20px;
  }
  
  .table-container input {
    font-size: 14px;
    padding: 5px 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
  
  .table-container th {
    text-align: left;
    background-color: #f7fafc;
    color: #718096;
    font-size: 14px;
    font-weight: bold;
    padding: 10px;
    vertical-align: middle;
  }
  
  .table-container td {
    text-align: left;
    font-size: 14px;
    padding: 10px;
    vertical-align: middle;
  }
  
  .table-container tbody tr:nth-child(even) {
    background-color: #f7fafc;
  }
  
  .table-container tbody tr:hover {
    background-color: #edf2f7;
  }
  
  .table-container .button-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  
  .table-container .button-container button {
    font-size: 14px;
    border-radius: 5px;
    border: none;
    color: #fff;
    padding: 5px 10px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
  }
  
  .table-container .button-container button:hover {
    opacity: 0.8;
  }
  
  .table-container .button-container button.success {
    background-color: #48bb78;
  }
  
  .table-container .button-container button.danger {
    background-color: #f56565;
  }
  
  .table-container .button-container button.outline {
    background-color: transparent;
    color: #718096;
    border: 1px solid #718096;
  }
  
  .table-container .button-container button.outline:hover {
    background-color: #718096;
    color: #fff;
  }
  
  .table-container .button-container button .icon {
    margin-right: 5px;
  }
</style>

<div class="table-container">
  <Table>
    <thead>
      <tr>
        <th>Provincia</th>
        <th>Mes</th>
        <th>Viajeros</th>
        <th>Estancia nocturna</th>
        <th>Media de estancias</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><input bind:value={newDatosProvince} placeholder="Introduce provincia"></td>
        <td><input bind:value={newDatosMonth} placeholder="Introduce mes"></td>
        <td><input bind:value={newDatosTrav} placeholder="Introduce nº de viajeros"></td>
        <td><input bind:value={newDatosOS} placeholder="Introduce nº de estancias nocturnas"></td>
        <td><input bind:value={newDatosAS} placeholder="Introduce media de estancias"></td>

        <td>
          <div class="button-container">
            <Button color="success" outline size="sm" on:click={createOcuppationStats}>
              <Icon name="plus" class="icon"/> Añadir
            </Button>
            <Button color="danger" outline size="sm" on:click={deleteAllOcuppationStats}>
              <Icon name="trash" class="icon"/> Elimina todo
            </Button>
          </div>
        </td>
      </tr>
      {#each Datos as r}
        <tr>
          <td><a href="/occupation-stats/{r.province}/{r.month}">{r.province}</a></td>
          <td>{r.month}</td>
          <td>{r.traveler}</td>
          <td>{r.overnight_stay}</td>
          <td>{r.average_stay}</td>
          <td>
            <div class="button-container">
              <Button color="danger" outline size="sm" on:click={() => deleteOcuppationStats(r.province,r.month)}>
                <Icon name="x" class="icon" /> Eliminar
              </Button>
            </div>
          </td>
        </tr>
      {/each}
    </tbody>
  </Table>
</div>


