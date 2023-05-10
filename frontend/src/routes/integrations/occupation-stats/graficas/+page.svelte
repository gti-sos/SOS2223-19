<main>
    <body>
      <div class="button-container">
          <a class="button" href="graficas/withProxy">Con Proxy</a>
          <a class="button" href="graficas/withoutProxy">Sin Proxy</a>
        </div>
    </body>
  </main>
  
  <style>
      .button-container {
          margin-top: 350px; /* agrega un margen superior para separar los botones del encabezado */
          display: flex; /* establece la disposición de los botones en línea */
          justify-content: center; /* centra los botones horizontalmente */
      }
  
      .button {
          display: inline-block; /* asegura que los botones no se muestren uno debajo del otro */
          padding: 20px 40px; /* aumenta el espacio interno del botón */
          font-size: 24px; /* aumenta el tamaño del texto */
          background-color: #0077cc; /* cambia el color de fondo del botón */
          color: #fff; /* cambia el color del texto del botón */
          text-decoration: none; /* elimina el subrayado predeterminado */
          margin-right: 20px; /* agrega un margen a la derecha para separar los botones */
      }
  
      .button:last-child {
          margin-right: 0; /* elimina el margen derecho del último botón para evitar que se desborde */
      }
  </style>