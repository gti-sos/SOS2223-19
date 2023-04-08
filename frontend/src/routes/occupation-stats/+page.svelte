<script lang="ts">

  // @ts-nocheck
  import { onMount } from 'svelte';
  import { dev } from '$app/environment';
  import { Table } from 'sveltestrap';
  
  let API = '/api/v1/occupation-stats';
  
  if (dev) API = 'http://localhost:12345'+API;
  
  let Datos = [];
  let newDatosProvince = 'province';
  let newDatosMonth = 'month';


  let result = "";
  let resultStatus = "";

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

  onMount(async () => {
    await getOccupationStats();
  });

</script>

<h1>Occupation-stats</h1>


<Table>
  <thead>
    <tr>
      <th>Province</th>
      <th>Month</th>
      <th>Travelers</th>
      <th>Overnight_stay</th>
      <th>Average_stay</th>
    </tr>
  </thead>
  <tbody>
    {#each Datos as r}
      <tr>
        
        <td>{r.province}</td>
        <td>{r.month}</td>
        <td>{r.traveler}</td>
        <td>{r.overnight_stay}</td>
        <td>{r.average_stay}</td>
      </tr>
    {/each}
  </tbody>
</Table>
<!-- <ul>
  {#each Datos as r}
  <li>{r.province}, {r.month}</li>
  {/each}
</ul> -->

<!-- {#if resultStatus != ""}
    <p>
        Result:
    </p>
    <pre>
{resultStatus}
{result}
    </pre>
{/if} -->
