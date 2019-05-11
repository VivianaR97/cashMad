
mostrarMeta();


/**
 * Función que muestra las metras del usuario, en caso de no tener muestra los campos vacíos para guardarla.
 */
function mostrarMeta() {
  // Creo las variables que serán alteradas al finalizar el proceso
  let nombreMeta = document.getElementById('nombre-meta');
  let objetivoMeta = document.getElementById('objetivo-meta');
  let fechaMeta = document.getElementById('fecha-meta');
  let nombreMetaCarta = document.getElementById('nombre-meta-carta');


  // Creo la variable req para la petición de AJAX
  let req = new XMLHttpRequest();

  req.onload = () => {

    if (req.status == 200) {
      // Recibo la respuesta del servidor y sustituyo los datos en caso de tener
      if (req.response != undefined) {

        if (req.response != '') {
          let arregloMeta = req.response.split(',');
          nombreMeta.value = arregloMeta[0];
          nombreMetaCarta.textContent = arregloMeta[0];
          objetivoMeta.value = arregloMeta[1].trim();
          fechaMeta.value = arregloMeta[2].trim();

        } else {
          activarCampos();
        }
      }

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
 * Función que activa los campos sobre la meta, para poder editarlos.
 */
function activarCampos() {
  document.getElementById('nombre-meta').removeAttribute('disabled');
  document.getElementById('objetivo-meta').removeAttribute('disabled');
  document.getElementById('fecha-meta').removeAttribute('disabled');
  document.getElementById('boton-guardar-meta').removeAttribute('disabled');

};

/**
 * Función que valida los campos requeridos para la meta y así poder hacer un correcto envío.
 */
function validarCamposMeta() {
  let nombre = document.getElementById('nombre-meta');
  let objetivo = document.getElementById('objetivo-meta');
  let fecha = document.getElementById('fecha-meta');
  let mensajeError = document.getElementById('error-message-meta');
  if (nombre.value != '' && objetivo.value != '' && fecha.value != '') {
    if (isNaN(objetivo.value)) {
      mensajeError.textContent = 'El objetivo debe ser numérico';
      mensajeError.style.display = 'block';
      return false;
    } else {
      if (/^(0?[1-9]|1[012])[\/](0?[1-9]|[12][0-9]|3[01])[\/]\d{4}$/.test(fecha.value)) {
        mensajeError.textContent = '';
        mensajeError.style.display = 'none';
        return true;
      } else {
        mensajeError.textContent = 'Formato dd/mm/aaaa';
        mensajeError.style.display = 'block';
        return false;
      }
    }
  } else {
    mensajeError.textContent = 'Debe ingresar datos';
    mensajeError.style.display = 'block';
    return false;
  }
}

/**
 * Función que envía los datos actualizados de la meta del usuario. 
 * Ya sea para ingresar meta o para actualizarla.
 */
function editarMeta() {
  if (validarCamposMeta()) {
    let datosMeta = {
      nombreMeta: document.getElementById('nombre-meta').value,
      objetivoMeta: document.getElementById('objetivo-meta').value,
      fechaMeta: document.getElementById('fecha-meta').value
    }

    let req = new XMLHttpRequest;

    req.onload = () => {
      console.log('Meta guardada correctamente');
      mostrarMeta();
    }

    req.open('POST', '/editarMeta');

    req.setRequestHeader('Content-type', 'application/json');
    req.send(JSON.stringify(datosMeta));
  }
}

function logout() {
  let req = new XMLHttpRequest;

  req.onload = () => {
    if (req.status == 200) {
      window.location.href = req.responseText;
    }
  }

  req.open('GET', '/destroySession');
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