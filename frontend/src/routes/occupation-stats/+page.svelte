<script lang="ts">
  // @ts-nocheck

  import { onMount } from 'svelte';
  import { dev } from '$app/environment';
  import { Button, Table, Alert, Icon } from 'sveltestrap';
  import {} from "./style.css";
  
  onMount(async () => {
    await getOccupationStats();
  });

  let API = '/api/v2/occupation-stats';
  
  if (dev) API = 'http://localhost:12345'+API;
  

  let newDatosProvince = '';
  let newDatosMonth = '';
  let newDatosTrav = '';
  let newDatosOS = '';
  let newDatosAS= '';

  let searchProvince = "";
  let searchMonth = "";
  let searchTrav = "";
  let searchOS = "";
  let searchAS = "";

  let datos= [];
  let result = "";
  let resultStatus = "";
  
  let message = "";
  let c = "";

  let limit =10;
  let offset=0;
  let currentPage = 0;
  let totalPages = 1;
  

  async function getOccupationStats() {
    resultStatus = result = "";
    const res = await fetch(API+`?offset=${offset}&limit=${limit}`, {
      method: 'GET'
    });
    try {
      const data = await res.json();
      result = JSON.stringify(data, null, 2);
      datos= data;
    } catch (error) {
      console.log(`Error parsing result: ${error}`);
    }
    const status = await res.status;
    resultStatus = status;  
  }

  async function getLoadInitialData() {
    resultStatus = result = "";
    const res = await fetch(API+'/loadInitialData', {
      method: 'GET'
    });
    try {
      const data = await res.json();
      result = JSON.stringify(data, null, 2);
      datos= data;
    } catch (error) {
      console.log(`Error parsing result: ${error}`);
    }
    const status = await res.status;
    resultStatus = status;
    if (status==200) {
      getOccupationStats();
      message="Datos cargados correctamente"
      c="success";
     }else if(status==400){
      message="Los datos ya están cargados"
      c="warning";
     }else if(status==500){
      message="Error interno"
      c="danger";
     }

  }

  let searchres=[];
  async function searchData(searchProvince, searchMonth, searchTrav, searchOS, searchAS) {
    resultStatus = result = "";
    const params = { province: searchProvince, month: searchMonth, traveler: searchTrav, overnight_stay: searchOS, average_stay: searchAS };
    const validParams = Object.fromEntries(Object.entries(params).filter(value => value !== ""));
    const query = new URLSearchParams(validParams).toString();
    const res = await fetch(API+`?${query}`, {
      method: "GET"
    });
    
    try {
      const data = await res.json();
      result = JSON.stringify(data, null, 2);
      let data1 = Object.values(data);

      if (data1.length === 5) {
        const parsedData = [{
          province: data1[0],
          month: data1[1],
          traveler: parseFloat(data1[2]),
          overnight_stay: parseFloat(data1[3]),
          average_stay: parseFloat(data1[4])
        }];
        searchres = parsedData;
      }else{
        searchres = data1;
      }
    } catch (error) {
      console.log(`Error parsing result: ${error}`);
    }
    const status = await res.status;
    resultStatus = status;
    if (status == 200) {

      message = "Elemento encontrado";
      c = "success";
    } else if (status == 404) {
      message = "Elemento no encontrado";
      c = "danger";
    }else if (status == 500) {
      message = "Error interno";
      c = "danger";
    }
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
    async function previousPage() {
        offset -= limit;
        if(offset<0){
            offset += limit;
        }
        else {
          currentPage--;
          await getOccupationStats();
        }
    }
    async function nextPage() {
        offset += limit;
        if(offset>=12){
            offset -= limit;
        }
        else{
          currentPage++;
          await getOccupationStats();            
        }        
    }
</script>

<h1>Occupation-stats</h1>

{#if message != ""}
  <Alert color={c}>{message}</Alert>
{/if}

<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css" rel="stylesheet">

<div class="table-container">
  <Table>
    <thead>
      <tr>
        <td><input bind:value={searchProvince} placeholder="Introduce provincia"></td>
        <td><input bind:value={searchMonth} placeholder="Introduce mes"></td>
        <td><input bind:value={searchTrav} placeholder="Introduce nº de viajeros"></td>
        <td><input bind:value={searchOS} placeholder="Introduce nº de pernoctaciones"></td>
        <td><input bind:value={searchAS} placeholder="Introduce media de estancias"></td>
        <Button color="primary" outline size="sm" on:click={() => searchData(searchProvince, searchMonth, searchTrav, searchOS, searchAS)}>
          <Icon name="search" class="icon"/>
        </Button>
      </tr>
      <tr>
        <th>Provincia</th>
        <th>Mes</th>
        <th>Viajeros</th>
        <th>Pernoctación</th>
        <th>Media de estancias</th>
        <td>
          <Button color="primary" outline size="sm" on:click={() => getLoadInitialData()}>
            <Icon name="arrow-counterclockwise" class="icon" />
          </Button>
        </td>
      </tr>
    </thead>
    <tbody>
        {#each searchres as dato}
          <tr>
            <td><a href="/occupation-stats/{dato.province}/{dato.month}">{dato.province}</a></td>
            <td>{dato.month}</td>
            <td>{dato.traveler}</td>
            <td>{dato.overnight_stay}</td>
            <td>{dato.average_stay}</td>
            <td>
              <Button color="danger" outline size="sm" on:click={() => deleteOcuppationStats(dato.province,dato.month)}>
                <Icon name="x" class="icon" />
              </Button>
            </td>
          </tr>
        {/each}
      <tr>
        <td><input bind:value={newDatosProvince} placeholder="Introduce provincia"></td>
        <td><input bind:value={newDatosMonth} placeholder="Introduce mes"></td>
        <td><input bind:value={newDatosTrav} placeholder="Introduce nº de viajeros"></td>
        <td><input bind:value={newDatosOS} placeholder="Introduce nº de estancias nocturnas"></td>
        <td><input bind:value={newDatosAS} placeholder="Introduce media de estancias"></td>

        <td>
          <Button color="success" outline size="sm" on:click={createOcuppationStats}>
            <Icon name="plus" class="icon"/>
          </Button>
          <Button color="danger" outline size="sm" on:click={deleteAllOcuppationStats}>
            <Icon name="trash" class="icon"/> 
          </Button>
        </td>
      </tr>
      
      {#each datos as dato}
        <tr>
          <td><a href="/occupation-stats/{dato.province}/{dato.month}">{dato.province}</a></td>
          <td>{dato.month}</td>
          <td>{dato.traveler}</td>
          <td>{dato.overnight_stay}</td>
          <td>{dato.average_stay}</td>
          <td>
            <Button color="danger" outline size="sm" on:click={() => deleteOcuppationStats(dato.province,dato.month)}>
              <Icon name="x" class="icon" />
            </Button>
          </td>
        </tr>
      {/each}
    </tbody>
  </Table>

  <div id="buttons" style="text-align:center;">
    {#if currentPage > 0}
      <Button color="primary" outline size="sm" on:click={previousPage}><Icon name="arrow-bar-left" class="icon" /></Button>
    {/if}
    {#if currentPage<totalPages }
      <Button color="primary" outline size="sm" on:click={nextPage}><Icon name="arrow-bar-right" class="icon" /></Button>
    {/if}
  </div>

</div>


