<script lang="ts">

    // @ts-nocheck
    import { onMount } from 'svelte';
    import { dev } from '$app/environment';
    import { Button, Table, Alert, Icon,Pagination, PaginationItem, PaginationLink } from 'sveltestrap';
    
    onMount(async () => {
      await getRuralTourism();
    });
  
    let API = '/api/v2/occupancy-of-accomodation-in-rural-tourism';
    
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
  
    async function getRuralTourism() {
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

  function goToPage(page) {
  currentPage = page;
  const offset = (currentPage - 1) * itemsPerPage;
  const url = `http://localhost:8080/api/v2/andalusian-bicycle-plans?offset=${offset}&limit=${itemsPerPage}`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      bicyclePlans = data;
    })
    .catch(error => {
      console.error('Error fetching bicycle plans:', error);
    })
    .finally(() => {
      updateUrl();
    });
}

const itemsPerPage = 10;
let currentPage = 1;
  
    async function createRuralTourism() {
      resultStatus = result = "";
      const res = await fetch(API, {
        method: 'POST',
        headers:{
          "Content-Type" : "application/json"
        },
        body:JSON.stringify({
          province: newDatosProvince,
          month: newDatosMonth,
          traveller: newDatosTrav,
          overnight_stay: newDatosOS,
          average_stay: newDatosAS
        })
      });    
      
      const status = await res.status;
      resultStatus = status;
      if (status==201) {
        getRuralTourism();
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
  
    async function deleteRuralTousism(province,month) {
      resultStatus = result = "";
      const res = await fetch(API+"/"+province+"/"+month, {
        method: 'DELETE'
      });    
      
      const status = await res.status;
      resultStatus = status;
      if(status==200){
        getRuralTourism();
        message = "Elemento borrado";
        c = "success";
      } 
    }
  
    async function deleteAllRuralTourism() {
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

    async function searchContact(province, year, from, to, traveller, overnight_stay, average_stay) {
    busqueda = [];
    let url = `${API}`;
    let query_params = [];
    if (province) {
      query_params.push(`province=${province}`);
    }
    if (year) {
      query_params.push(`year=${year}`);
    }
    
     
     if(traveller){
      query_params.push(`traveller=${bicycle_over}`);
     }
     if(overnight_stay){
      query_params.push(`overnight_stay=${motorized_percentage_over}`);
     }
     if(average_stay){
      query_params.push(`average_stay=${population_over}`);
     }
    if (from !== undefined && to !== undefined) {
      if (from <= to) {
        query_params.push(`from=${from}`);
        query_params.push(`to=${to}`);
      } else {
        msgVisible = true;
        color = "danger";
        checkMSG = `El año de inicio debe ser menor o igual al año de fin`;
        return;
      }
    }
    if (query_params.length > 0) {
      url += `?${query_params.join("&")}`;
    }
    const res = await fetch(url);
    if (res.ok) {
      console.log("Buscando datos...");
      search = true;
      const json = await res.json();
      busqueda = json;
      console.log(busqueda);
      console.log(search);
      msgVisible = true;
      color = "success";
      checkMSG = `Busqueda realizada con exito`;
    } else {
      msgVisible = true;
      color = "danger";
      checkMSG = `No se encontraron resultados para los parametros ingresados`;
    }
  }
  
  </script>
  
  <h1>occupancy-of-accomodation-in-rural-tourism</h1>
  
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
    
    /*.table-container .button-container button {
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
    }*/
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
              <Button color="success" outline size="sm" on:click={createRuralTourism}>
                <Icon name="plus" class="icon"/> Añadir
              </Button>
              <Button color="danger" outline size="sm" on:click={deleteAllRuralTourism}>
                <Icon name="trash" class="icon"/> Elimina todo
              </Button>
            </div>
          </td>
        </tr>
        {#each Datos as r}
          <tr>
            <td><a href="/occupancy-of-accomodation-in-rural-tourism/{r.province}/{r.month}">{r.province}</a></td>
            <td>{r.month}</td>
            <td>{r.traveller}</td>
            <td>{r.overnight_stay}</td>
            <td>{r.average_stay}</td>
            <td>
              <div class="button-container">
                <Button color="danger" outline size="sm" on:click={() => deleteRuralTousism(r.province,r.month)}>
                  <Icon name="x" class="icon" /> Eliminar
                </Button>
              </div>
              
            </td>
          </tr>
        {/each}
      </tbody>
    </Table>
    
    <th style="text-align: center;">
      <Button outline color="primary" on:click="{() => searchContact()}">Buscar</Button>
    </th>
    <Pagination size="lg" ariaLabel="Page navigation example">
      <PaginationItem>
        <PaginationLink first on:click={() => goToPage(1)} href="#" />
      </PaginationItem>
      <PaginationItem>
        <PaginationLink previous on:click={() => goToPage(currentPage-1)} href="#" />
      </PaginationItem>
      {#each Array.from({ length: Math.ceil(Datos.length/itemsPerPage) }, (_, i) => i+1) as page}
        <PaginationItem>
          <PaginationLink on:click={() => goToPage(page)} href="#">{page}</PaginationLink>
        </PaginationItem>
      {/each}
      <PaginationItem>
        <PaginationLink next on:click={() => goToPage(currentPage+1)} href="#" />
      </PaginationItem>
      <PaginationItem>
        <PaginationLink last on:click={() => goToPage(Math.ceil(Datos.length/itemsPerPage))} href="#" />
      </PaginationItem>
    </Pagination>
  </div>
  
  
  