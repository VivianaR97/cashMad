mostrarMeta();


/**
 * Función que muestra las metras del usuario, en caso de no tener muestra los campos vacíos para guardarla.
 */
function mostrarMeta() {

  // Creo las variables que serán alteradas al finalizar el proceso
  let nombreMeta = document.getElementById('nombre-meta').value;
  let objetivoMeta = document.getElementById('objetivo-meta').value;
  let fechaMeta = document.getElementById('fecha-meta').value;

  // Creo la variable req para la petición de AJAX
  let req = new XMLHttpRequest();

  req.onload = () => {

    if (req.status == 200) {
        // Recibo la respuesta del servidor
        // En caso de tener meta la muestro

        // De lo contrario habilito la modificación de los campos
        console.log('Llegó al home')
      
    } else if (req.status == 403) {
      // 403: No autorizado
      errorMessageDiv.textContent = "Fallo en la conexión";
    } else {
      // Otro código HTTP
      errorMessageDiv.textContent = `Error inesperado : ${req.status}`;
    }
  }

  req.open("GET", "/cargarMeta");
  req.setRequestHeader('Content-type', 'application/json');
  req.send();

}





/**
 * FUNCIÓN EDITABLE PARA MODIFICAR META
 *
function mostrarMeta (){

  let nombreMeta = document.getElementById('nombre-meta').value;
  let objetivoMeta = document.getElementById('objetivo-meta').value;
  let fechaMeta = document.getElementById('fecha-meta').value;

  // Creo la variable req para la petición de AJAX
  let req = new XMLHttpRequest();

  req.onload = () => {

      if (req.status == 200) {


          // ACÁ VA EL RESPONSE



        window.location.href = req.responseText;
      } else if (req.status == 403) {
        // 403: No autorizado
        errorMessageDiv.textContent = "Fallo en la conexión";
      } else {
        // Otro código HTTP
        errorMessageDiv.textContent = `Error inesperado : ${req.status}`;
      }
    }

    req.open("POST", "/cargarMeta");

    let datosMeta = {
        nombreMeta: nombreMeta,
        objetivoMeta: objetivoMeta,
        fechaMeta: fechaMeta
    };

      req.setRequestHeader('Content-type', 'application/json');
      req.send(JSON.stringify(datosMeta));

}



 */