<script>
    // @ts-nocheck
    import { onMount } from 'svelte';
    import { dev } from '$app/environment';
  
    let API = 'api/v1/occupation-stats';
  
    if (dev) API = `http://localhost:12345/${API}`;
  
    let Datos = [];

  let result = "";
  let resultStatus = "";

  async function getOccupationStats() {
  resultStatus = result = "";
  const res = await fetch(API, {
    method: 'GET'
  });
  try {
    const data = await res.json();
    console.log('Datos recuperados:', data); // Agregado
    result = JSON.stringify(data, null, 2);
    Datos = data;
    console.log('Datos asignados:', Datos); // Agregado
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
<ul>
  {#each Datos as r}
  <li>{r.province}</li>
  {/each}
</ul>

{#if resultStatus != ""}
    <p>
        Result:
    </p>
    <pre>
        {resultStatus}
        {result}
        {console.log(Datos)} // Agregado
    </pre>
{/if}
