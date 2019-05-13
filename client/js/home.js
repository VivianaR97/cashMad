
mostrarMeta();
tablaIngresos();



// <----------------- FUNCIONALIDADES SOBRE LA META USUARIO ----------------->
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
    if (req.readyState == 4) {
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
        errorMessageDiv.textContent = 'Fallo en la conexión';
      } else {
        // Otro código HTTP
        errorMessageDiv.textContent = `Error inesperado : ${req.status}`;
      }
    }
  }
  req.open('GET', '/cargarMeta');
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
      document.getElementById('boton-guardar-meta').setAttribute('disabled', true);
      return false;
    } else {
      if (/^(?:(?:(0?[1-9]|1\d|2[0-8])[/](0?[1-9]|1[0-2])|(29|30)[/](0?[13-9]|1[0-2])|(31)[/](0?[13578]|1[02]))[/](0{2,3}[1-9]|0{1,2}[1-9]\d|0?[1-9]\d{2}|[1-9]\d{3})|(29)[/](0?2)[/](\d{1,2}(?:0[48]|[2468][048]|[13579][26])|(?:0?[48]|[13579][26]|[2468][048])00))$/.test(fecha.value)) {
        mensajeError.textContent = '';
        mensajeError.style.display = 'none';
        document.getElementById('boton-guardar-meta').removeAttribute('disabled');
        return true;
      } else {
        mensajeError.textContent = 'Formato dd/mm/aaaa';
        mensajeError.style.display = 'block';
        document.getElementById('boton-guardar-meta').setAttribute('disabled', true);
        return false;
      }
    }
  } else {
    mensajeError.textContent = 'Debe ingresar datos';
    mensajeError.style.display = 'block';
    document.getElementById('boton-guardar-meta').setAttribute('disabled', true);
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
      document.getElementById('boton-guardar-meta').setAttribute('disabled', true);
      document.getElementById('nombre-meta').setAttribute('disabled', true);
      document.getElementById('objetivo-meta').setAttribute('disabled', true);
      document.getElementById('fecha-meta').setAttribute('disabled', true);
      mostrarMeta();
    }

    req.open('POST', '/editarMeta');

    req.setRequestHeader('Content-type', 'application/json');
    req.send(JSON.stringify(datosMeta));
  }
}



// <----------------- FUNCIONALIDADES SOBRE INGRESOS ----------------->
/**
 * Función que carga automáticamente la lista con todos los ingresos del usuario en sesión.
 */
function tablaIngresos() {
  let ulLista = document.getElementById('coleccion-ingresos');
  let li = '';
  let req = new XMLHttpRequest;

  req.onload = () => {
    if (req.readyState == 4) {
      if (req.status == 200) {
        if (req.response != '') {
          let arregloPorIngreso = req.response.split(',');
          for (let i = 0; i < arregloPorIngreso.length - 1; i++) {
            let arregloDividido = arregloPorIngreso[i].split(';');
            li += `
            <li id="li-ingresos" class="collection-item">
              <a class="secondary-content">
                  <i onclick="mostrarIngreso('${arregloDividido[0]}',0)" class="icono-ingreso material-icons">edit</i>
                  <i onclick="mostrarIngreso('${arregloDividido[0]}',1)" class="icono-ingreso material-icons">not_interested</i>
              </a>
              <div>${arregloDividido[1]}
                <br>
                Descripción: ${arregloDividido[2]}
              </div>
            </li>`;
            ulLista.innerHTML = li;
          }
        } else {
          ulLista.style.display = 'none';
        }
      }
    }
  }

  req.open('GET', '/tablaIngresos');
  req.setRequestHeader('Content-type', 'application/json');
  req.send();
}

function graficaIngresos() {
  let req = new XMLHttpRequest;

  req.onload = () => {

  }
  req.open('GET', '/graficaIngresos');
  req.send();
}

/**
 * Función que muestra los campos de ingreso y deshabilita el botón "agregar ingreso".
 */
function camposIngreso() { 
  document.getElementById('nuevo-ingreso').style.display = 'block';
  document.getElementById('boton-campos-ingreso').setAttribute('disabled', true);
  document.getElementById('div-boton-ingreso').innerHTML = `
                            <a disabled id="boton-guardar-ingreso" onclick="agregarIngreso()"
                            class="boton-ingreso center waves-effect waves-light btn">Agregar</a>`;
}

/**
 * Función que valida los campos del nuevo ingreso.
 */
function validarCamposIngreso() {
  let monto = document.getElementById('monto-nuevo-ingreso').value;
  let descripcion = document.getElementById('descripcion-nuevo-ingreso').value;
  let fecha = document.getElementById('fecha-nuevo-ingreso').value;
  let errorMessageDiv = document.getElementById('error-nuevo-ingreso');

  if (monto != '' && descripcion != '' && fecha != '') {
    if (isNaN(monto)) {
      errorMessageDiv.textContent = 'El objetivo debe ser numérico';
      errorMessageDiv.style.display = 'block';
      document.getElementById('boton-guardar-ingreso').setAttribute('disabled', true);
      return false;
    } else {
      if (/^(?:(?:(0?[1-9]|1\d|2[0-8])[/](0?[1-9]|1[0-2])|(29|30)[/](0?[13-9]|1[0-2])|(31)[/](0?[13578]|1[02]))[/](0{2,3}[1-9]|0{1,2}[1-9]\d|0?[1-9]\d{2}|[1-9]\d{3})|(29)[/](0?2)[/](\d{1,2}(?:0[48]|[2468][048]|[13579][26])|(?:0?[48]|[13579][26]|[2468][048])00))$/.test(fecha)) {
        errorMessageDiv.textContent = '';
        errorMessageDiv.style.display = 'none';
        document.getElementById('boton-guardar-ingreso').removeAttribute('disabled');
        return true;
      } else {
        errorMessageDiv.textContent = 'Formato dd/mm/aaaa';
        errorMessageDiv.style.display = 'block';
        document.getElementById('boton-guardar-ingreso').setAttribute('disabled', true);
        return false;
      }
    }
  } else {
    errorMessageDiv.textContent = 'Debe ingresar datos';
    errorMessageDiv.style.display = 'block';
    document.getElementById('boton-guardar-ingreso').setAttribute('disabled', true);
    return false;
  }
}

/**
 * Función que cancela el nuevo ingreso, reinicia los valores de los campos 
 * y habilita el botón "agregar ingreso".
 */
function cancelarIngreso() {
  let rowIngreso = document.getElementById('nuevo-ingreso');
  rowIngreso.style.display = 'none';
  let botonNuevoIngreso = document.getElementById('boton-campos-ingreso');
  botonNuevoIngreso.removeAttribute('disabled');
  document.getElementById('monto-nuevo-ingreso').value = '';
  document.getElementById('descripcion-nuevo-ingreso').value = '';
  document.getElementById('fecha-nuevo-ingreso').value = '';
  document.getElementById('error-nuevo-ingreso').textContent = '';
  document.getElementById('error-nuevo-ingreso').style.display = 'none';

}

/**
 * Función que agrega un ingreso para el usuario en sesión.
 */
function agregarIngreso() {
  if (validarCamposIngreso()) {
    let arregloIngreso = {
      monto: document.getElementById('monto-nuevo-ingreso').value,
      descripcion: document.getElementById('descripcion-nuevo-ingreso').value,
      fecha: document.getElementById('fecha-nuevo-ingreso').value
    }

    let req = new XMLHttpRequest;
    req.onload = () => {
      if (req.readyState == 4) {
        if (req.status == 200) {
          tablaIngresos();
          cancelarIngreso();
        }
      } else {
        console.log('Error al cargar meta');
      }
    }

    req.open('POST', '/agregarIngreso');
    req.setRequestHeader('Content-type', 'application/json');
    req.send(JSON.stringify(arregloIngreso));
  }
}

/**
 * Función que envía el _id de un ingreso para mostrar y habilita la función para editar el ingreso.
 * Verifica si lo que quiere es editarse o eliminarse el documento.
 */
function mostrarIngreso(idIngreso, validador) {
  if (idIngreso != undefined) {
    let id = {
      id: idIngreso
    }
    let req = new XMLHttpRequest;

    req.onload = () => {
      if (req.readyState == 4) {
        if (req.status == 200) {
          let ingreso = req.response.split(',');
          camposIngreso();
          document.getElementById('monto-nuevo-ingreso').value = ingreso[0];
          document.getElementById('descripcion-nuevo-ingreso').value = ingreso[1];
          document.getElementById('fecha-nuevo-ingreso').value = ingreso[2];

          if (validador == 0) {
            // Si el validador es 0, la función es para editar el ingreso, por lo que se habilitan los campos
            document.getElementById('monto-nuevo-ingreso').removeAttribute('disabled');
            document.getElementById('descripcion-nuevo-ingreso').removeAttribute('disabled');
            document.getElementById('fecha-nuevo-ingreso').removeAttribute('disabled');
            document.getElementById('div-boton-ingreso').innerHTML = `
            <a disabled id="boton-guardar-ingreso" onclick="editarIngreso('${idIngreso}')"
            class="boton-ingreso center waves-effect waves-light btn">EDITAR</a>`;
          } else {

            // De lo contrario queda todo deshabilitado, excepto el botón para eliminar el documento.
            document.getElementById('monto-nuevo-ingreso').setAttribute('disabled', true);
            document.getElementById('descripcion-nuevo-ingreso').setAttribute('disabled', true);
            document.getElementById('fecha-nuevo-ingreso').setAttribute('disabled', true);
            document.getElementById('div-boton-ingreso').innerHTML = `
            <a id="boton-guardar-ingreso" onclick="eliminarIngreso('${idIngreso}')"
            class="boton-ingreso center waves-effect waves-light btn">ELIMINAR</a>`;
          }
        }
      }
    }

    req.open('POST', '/getIngreso');
    req.setRequestHeader('Content-type', 'application/json');
    req.send(JSON.stringify(id));


  } else {
    console.log('error pedido');
  }
}

/**
 * función que envía el id y los valores de los campos de ingreso a base, para ser actualizados.
 */
function editarIngreso(idIngreso) {
  if (idIngreso != undefined) {
    // arregloDatos que será enviado al servidor
    let arregloDatos = {
      id: idIngreso,
      monto: document.getElementById('monto-nuevo-ingreso').value,
      descripcion: document.getElementById('descripcion-nuevo-ingreso').value,
      fecha: document.getElementById('fecha-nuevo-ingreso').value
    }
    let req = new XMLHttpRequest;

    req.onload = () => {
      if (req.readyState == 4) {
        if (req.status == 200) {
          tablaIngresos();
          cancelarIngreso();
        }
      }
    }

    req.open('POST', '/editarIngreso');
    req.setRequestHeader('Content-type', 'application/json');
    req.send(JSON.stringify(arregloDatos));
  }
}

/**
 * Función que solicitará vía AJAX eliminar un documento de la colección ingreso, recibiendo su id.
 */
function eliminarIngreso(idIngreso) {
  if (idIngreso != undefined) {
    let id = {
      id: idIngreso
    }

    let req = new XMLHttpRequest;
    req.onload = () => {
      if (req.readyState == 4) {
        if (req.status == 200) {
          tablaIngresos();
          cancelarIngreso();
        }
      }
    }

    req.open('POST', '/eliminarIngreso');
    req.setRequestHeader('Content-type', 'application/json');
    req.send(JSON.stringify(id));

  } else {
    console.log('error pedido');
  }
}

function logout() {
  let req = new XMLHttpRequest;

  req.onload = () => {
    if (req.readyState == 4) {
      if (req.status == 200) {
        window.location.href = req.responseText;
      }
    }
  }

  req.open('GET', '/destroySession');
  req.send();
}

