<script>
    //@ts-nocheck
    import { onMount } from 'svelte';
    import { Table } from 'sveltestrap';

    let datos = [];
    let datos1 = [];
    let result = "";
    let result1 = "";
    let resultStatus = "";
    
  

    async function getDatosQuotes() {
        resultStatus = result = "";
        const res = await fetch("https://api.api-ninjas.com/v1/quotes?limit=10" , {
            method: 'GET',
            headers: { 'X-Api-Key': '1LDZAk3D5aUG7UWnuNlRUQ==uOowMiQ0uVLRVBus'},
            contentType: 'application/json'
        });
        try {
            const data = await res.json();
            result = JSON.stringify(data, null, 2);
            datos= data;
            getDatosTrivial()
        } catch (error) {
            console.log(`Error parsing result: ${error}`);
        }
        const status = await res.status;
        resultStatus = status;  
    }

    async function getDatosTrivial() {
        resultStatus = result1 = "";
        const res = await fetch("https://api.api-ninjas.com/v1/trivia?limit=30" , {
            method: 'GET',
            headers: { 'X-Api-Key': '1LDZAk3D5aUG7UWnuNlRUQ==uOowMiQ0uVLRVBus'},
            contentType: 'application/json'
        });
        try {
            const data = await res.json();
            result1 = JSON.stringify(data, null, 2);
            datos1= data;
        } catch (error) {
            console.log(`Error parsing result: ${error}`);
        }
        const status = await res.status;
        resultStatus = status;  
    }

    onMount(async () => {
        await getDatosQuotes();
    });

</script>


<h1 class="table-title">Tabla 1: Citas de autores famosos por categoría</h1>

<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css" rel="stylesheet">

<div class="table-container">
  <Table>
    <thead>
      <tr>
        <th>Cita</th>
        <th>Autor</th>
        <th>Categoria</th>
      </tr>
    </thead>
    <tbody>
      {#each datos as dato}
        <tr>
          <td>{dato.quote}</td>
          <td>{dato.author}</td>
          <td>{dato.category}</td>
        </tr>
      {/each}
    </tbody>
  </Table>
</div> 

<h1 class="table-title">Tabla 2: Preguntas de trivial y sus respuestas</h1>
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css" rel="stylesheet">

<div class="table-container">
  <Table>
    <thead>
      <tr>
        <th>Categoria</th>
        <th>Pregunta</th>
        <th>Respuesta</th>
      </tr>
    </thead>
    <tbody>
      {#each datos1 as dat}
        <tr>
          <td>{dat.category}</td>
          <td>{dat.question}</td>
          <td>{dat.answer}</td>
        </tr>
      {/each}
    </tbody>
  </Table>
</div> 

<style>

    .table-title {
        text-align: center;
        margin-top: 20px;
        font-family: Arial, sans-serif;
        color: #333;
    }

    .table-container {
        margin-top: 20px;
        margin-left: auto;
        margin-right: auto;
        width: 80%;
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
</style>