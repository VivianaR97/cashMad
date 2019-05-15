
mostrarMeta();
tablaIngresos();
datosGraficaIngresos();
tablaEgresos();
datosGraficaEgresos();


// <-----<------------ FUNCIONALIDADES SOBRE LA META USUARIO ----------------->
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
              <div>${arregloDividido[1]}$
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

/**
 * Función que pide los datos para mostrar la gráfica de ingresos del usuario en sesión
 */
function datosGraficaIngresos() {
  let req = new XMLHttpRequest;

  req.onload = () => {
    if (req.readyState == 4) {
      if (req.status == 200) {
        if (req.response != undefined) {
          graficaIngresos(req.response);
        } else {
          graficaIngresos('ARREGLO PREDETERMINADO NULO');
        }
      }
    }
  }
  req.open('GET', '/graficaIngresos');
  req.send();
}

/**
 * Función que muestra la gráfica de ingresos del usuario en sesión 
 */
function graficaIngresos(arregloIngresos) {
  if (arregloIngresos != undefined) {
    let enero = 0;
    let febrero = 0;
    let marzo = 0;
    let abril = 0;
    let mayo = 0;
    let junio = 0;
    let julio = 0;
    let agosto = 0;
    let septiembre = 0;
    let octubre = 0;
    let noviembre = 0;
    let diciembre = 0;

    let documentosIngreso = arregloIngresos.split(',');
    for (let i = 0; i < documentosIngreso.length; i++) {
      let documentoIngreso = documentosIngreso[i].split(';');
      switch (documentoIngreso[1]) {
        case '01':
          enero += parseInt(documentoIngreso[0]);
          break;
        case '02':
          febrero += parseInt(documentoIngreso[0]);
          break;
        case '03':
          marzo += parseInt(documentoIngreso[0]);
          break;
        case '04':
          abril += parseInt(documentoIngreso[0]);
          break;
        case '05':
          mayo += parseInt(documentoIngreso[0]);
          break;
        case '06':
          junio += parseInt(documentoIngreso[0]);
          break;
        case '07':
          julio += parseInt(documentoIngreso[0]);
          break;
        case '08':
          agosto += parseInt(documentoIngreso[0]);
          break;
        case '09':
          septiembre += parseInt(documentoIngreso[0]);
          break;
        case '10':
          octubre += parseInt(documentoIngreso[0]);
          break;
        case '11':
          noviembre += parseInt(documentoIngreso[0]);
          break;
        case '12':
          diciembre += parseInt(documentoIngreso[0]);
          break;
      }
    }

    var ctx = document.getElementById('graficaIngresos').getContext('2d');
    var chart = new Chart(ctx, {
      // Grafica en forma de líneas
      type: 'line',

      // Los valores de la gráfica
      data: {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        datasets: [{
          label: 'Ingreso ($)',
          backgroundColor: 'rgb(174, 213, 129)',
          borderColor: 'rgb(139, 195, 74)',
          data: [enero, febrero, marzo, abril, mayo, junio, julio, agosto, septiembre, octubre, noviembre, diciembre]
        }]
      }
    });
  }



}

/**
 * Función que muestra los campos de ingreso y deshabilita el botón "agregar ingreso".
 */
function camposIngreso() {
  document.getElementById('monto-nuevo-ingreso').removeAttribute('disabled');
  document.getElementById('descripcion-nuevo-ingreso').removeAttribute('disabled');
  document.getElementById('fecha-nuevo-ingreso').removeAttribute('disabled');
  document.getElementById('nuevo-ingreso').style.display = 'block';
  document.getElementById('boton-campos-ingreso').setAttribute('disabled', true);
  document.getElementById('div-boton-ingreso').innerHTML = `
                            <a disabled id="boton-guardar-ingreso" onclick="agregarIngreso()"
                            class="boton-ingreso center waves-effect waves-light btn">AGREGAR</a>`;
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
          datosGraficaIngresos();
        }
      } else {
        console.log('Error al cargar ingreso');
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
          datosGraficaIngresos();
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
          datosGraficaIngresos();
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











// <----------------- FUNCIONALIDADES SOBRE EGRESOS ----------------->
/**
 * Función que carga automáticamente la lista con todos los ingresos del usuario en sesión.
 */
function tablaEgresos() {
  let ulLista = document.getElementById('coleccion-egresos');
  let li = '';
  let req = new XMLHttpRequest;

  req.onload = () => {
    if (req.readyState == 4) {
      if (req.status == 200) {
        if (req.response != '') {
          let arregloPorEgreso = req.response.split(',');
          for (let i = 0; i < arregloPorEgreso.length - 1; i++) {
            let arregloDividido = arregloPorEgreso[i].split(';');
            let categoria = categoriaEgreso(arregloDividido[2].trim());
            li += `
            <li id="li-egresos" class="collection-item">
              <a class="secondary-content">
                  <i onclick="mostrarEgreso('${arregloDividido[0]}',0)" class="icono-egreso material-icons">edit</i>
                  <i onclick="mostrarEgreso('${arregloDividido[0]}',1)" class="icono-egreso material-icons">not_interested</i>
              </a>
              <div>${arregloDividido[1]}$
                <br>
                Categoría: <a class="categoria-egreso${arregloDividido[2].trim()}">${categoria}</a> 
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

  req.open('GET', '/tablaEgresos');
  req.setRequestHeader('Content-type', 'application/json');
  req.send();
}

/**
 * Función que recibe el id de una categoría y envía como respuesta el nombre al que pertenece. 
 */
function categoriaEgreso(idCategoria) {
  switch (idCategoria) {
    case '1':
      return 'Alquiler';
    case '2':
      return 'Comida';
    case '3':
      return 'Estudios';
    case '4':
      return 'Deudas';
    case '5':
      return 'Tecnología';
    case '6':
      return 'Ocio';
  }
}

/**
 * Función que pide los datos para mostrar la gráfica de egresos del usuario en sesión
 */
function datosGraficaEgresos() {
  let req = new XMLHttpRequest;

  req.onload = () => {
    if (req.readyState == 4) {
      if (req.status == 200) {
        if (req.response != undefined) {
          graficaEgresos(req.response);
        } else {
          graficaEgresos('ARREGLO PREDETERMINADO NULO');
        }
      }
    }
  }
  req.open('GET', '/graficaEgresos');
  req.send();
}

/**
 * Función que muestra la gráfica de egresos del usuario en sesión 
 */
function graficaEgresos(arregloEgresos) {
  
  if (arregloEgresos != undefined) {
    let alquiler = 0;
    let comida = 0;
    let estudios = 0;
    let deudas = 0;
    let tecnologia = 0;
    let ocio = 0;

    let documentosEgreso = arregloEgresos.split(',');
    for (let i = 0; i < documentosEgreso.length; i++) {
      let documentoEgreso = documentosEgreso[i].split(';');
      switch (documentoEgreso[1]) {
        case '1':
          alquiler += parseInt(documentoEgreso[0]);
          break;
        case '2':
          comida += parseInt(documentoEgreso[0]);
          break;
        case '3':
          estudios += parseInt(documentoEgreso[0]);
          break;
        case '4':
          deudas += parseInt(documentoEgreso[0]);
          break;
        case '5':
          tecnologia += parseInt(documentoEgreso[0]);
          break;
        case '6':
          ocio += parseInt(documentoEgreso[0]);
          break;
      }
    }
    cartasEgresos(alquiler,comida,estudios,deudas,tecnologia,ocio);
    var ctx = document.getElementById('graficaEgresos').getContext('2d');
    var chart = new Chart(ctx, {
      // Grafica en forma de líneas
      type: 'bar',

      // Los valores de la gráfica
      data: {
        labels: ['Alquiler', 'Comida', 'Estudios', 'Deudas', 'Tecnologia', 'Ocio'],
        datasets: [{
          label: 'Cantidad de egresos ($)',
          backgroundColor: ['rgb(186, 139, 122)', 'rgb(247, 204, 76)', 'rgb(212, 225, 87)', 'rgb(255, 82, 82)', 'rgb(100, 181, 246)', 
          'rgb(186, 104, 200)', 'rgb(240, 98, 146)'] ,
          borderColor: 'rgb(255, 255, 255)',
          data: [alquiler, comida, estudios, deudas, tecnologia, ocio]
        }]
      }
    });
  }
}

/**
 * Función que muestra los porcentajes de egresos en base a los egresos totales.
 */
function cartasEgresos(alquiler,comida,estudios,deudas,tecnologia,ocio) {
  // Establece una variable total y los porcentajes de cada categoría
  if (alquiler != 0 || comida != 0 || estudios != 0 || deudas != 0 || tecnologia != 0 || ocio != 0) {
    total = alquiler+comida+estudios+deudas+tecnologia+ocio;
    alquiler = ((alquiler*100)/total).toFixed(1);
    comida = ((comida*100)/total).toFixed(1);
    estudios = ((estudios*100)/total).toFixed(1);
    deudas = ((deudas*100)/total).toFixed(1);
    tecnologia = ((tecnologia*100)/total).toFixed(1);
    ocio = ((ocio*100)/total).toFixed(1);
  
    // Inserta la información en las cartas del DOM
    document.getElementById('porcentaje1').textContent = alquiler+'%';
    document.getElementById('porcentaje2').textContent = comida+'%';
    document.getElementById('porcentaje3').textContent = estudios+'%';
    document.getElementById('porcentaje4').textContent = deudas+'%';
    document.getElementById('porcentaje5').textContent = tecnologia+'%';
    document.getElementById('porcentaje6').textContent = ocio+'%';
  }
  
}

/**
 * Función que muestra los campos de egreso y deshabilita el botón "agregar egreso".
 */
function camposEgreso() {
  habilitarSelects(0);
  document.getElementById('monto-nuevo-egreso').removeAttribute('disabled');
  document.getElementById('fecha-nuevo-egreso').removeAttribute('disabled');
  document.getElementById('nuevo-egreso').style.display = 'block';
  document.getElementById('boton-campos-egreso').setAttribute('disabled', true);
  document.getElementById('div-boton-egreso').innerHTML = `
                            <a disabled id="boton-guardar-egreso" onclick="agregarEgreso()"
                            class="boton-egreso center waves-effect waves-light btn">AGREGAR</a>`;
}

/**
 * Función que reinicia todos los checkboxes, setea la propiedad checked al validado y 
 * introduce en el input de categoria el número de la categoría seleccionada.
 */
function validarSelect(idCategoria) {
  if (idCategoria != undefined) {
    document.getElementById(`select1`).checked = '';
    document.getElementById(`select2`).checked = '';
    document.getElementById(`select3`).checked = '';
    document.getElementById(`select4`).checked = '';
    document.getElementById(`select5`).checked = '';
    document.getElementById(`select6`).checked = '';
    document.getElementById(`select${idCategoria}`).checked = 'checked';
    document.getElementById('categoria-nuevo-egreso').value = idCategoria;
  }
}

function habilitarSelects(validador) {
  if (validador == 0) {
    // Si el validador es 0, la función busca editar el documento, por lo cual se habilitan los checkboxes
    document.getElementById(`select1`).removeAttribute('disabled');
    document.getElementById(`select2`).removeAttribute('disabled');
    document.getElementById(`select3`).removeAttribute('disabled');
    document.getElementById(`select4`).removeAttribute('disabled');
    document.getElementById(`select5`).removeAttribute('disabled');
    document.getElementById(`select6`).removeAttribute('disabled');
  } else {
    // Si el validador es 1, la función busca eliminar el documento, por lo cual se deshabilitan los checkboxes
    document.getElementById(`select1`).setAttribute('disabled',true);
    document.getElementById(`select2`).setAttribute('disabled',true);
    document.getElementById(`select3`).setAttribute('disabled',true);
    document.getElementById(`select4`).setAttribute('disabled',true);
    document.getElementById(`select5`).setAttribute('disabled',true);
    document.getElementById(`select6`).setAttribute('disabled',true); 
  }
}

/**
 * Función que valida los campos del nuevo egreso.
 */
function validarCamposEgreso() {
  let monto = document.getElementById('monto-nuevo-egreso').value;
  let categoria = document.getElementById('categoria-nuevo-egreso').value;
  let fecha = document.getElementById('fecha-nuevo-egreso').value;
  let errorMessageDiv = document.getElementById('error-nuevo-egreso');

  if (monto != '' && categoria != '' && fecha != '') {
    if (isNaN(monto)) {
      errorMessageDiv.textContent = 'El objetivo debe ser numérico';
      errorMessageDiv.style.display = 'block';
      document.getElementById('boton-guardar-egreso').setAttribute('disabled', true);
      return false;
    } else {
      if (/^(?:(?:(0?[1-9]|1\d|2[0-8])[/](0?[1-9]|1[0-2])|(29|30)[/](0?[13-9]|1[0-2])|(31)[/](0?[13578]|1[02]))[/](0{2,3}[1-9]|0{1,2}[1-9]\d|0?[1-9]\d{2}|[1-9]\d{3})|(29)[/](0?2)[/](\d{1,2}(?:0[48]|[2468][048]|[13579][26])|(?:0?[48]|[13579][26]|[2468][048])00))$/.test(fecha)) {
        errorMessageDiv.textContent = '';
        errorMessageDiv.style.display = 'none';
        document.getElementById('boton-guardar-egreso').removeAttribute('disabled');
        return true;
      } else {
        errorMessageDiv.textContent = 'Formato dd/mm/aaaa';
        errorMessageDiv.style.display = 'block';
        document.getElementById('boton-guardar-egreso').setAttribute('disabled', true);
        return false;
      }
    }
  } else {
    errorMessageDiv.textContent = 'Debe ingresar datos';
    errorMessageDiv.style.display = 'block';
    document.getElementById('boton-guardar-egreso').setAttribute('disabled', true);
    return false;
  }
}


/**
 * Función que cancela el nuevo egreso, reinicia los valores de los campos 
 * y habilita el botón "agregar egreso".
 */
function cancelarEgreso() {
  let rowIngreso = document.getElementById('nuevo-egreso');
  rowIngreso.style.display = 'none';
  let botonNuevoIngreso = document.getElementById('boton-campos-egreso');
  botonNuevoIngreso.removeAttribute('disabled');
  // Elimina las variables de almacenamiento
  document.getElementById('monto-nuevo-egreso').value = '';
  document.getElementById('categoria-nuevo-egreso').value = '';
  document.getElementById('fecha-nuevo-egreso').value = '';
  document.getElementById('error-nuevo-egreso').textContent = '';
  document.getElementById('error-nuevo-egreso').style.display = 'none';
  document.getElementById(`select1`).checked = '';
  document.getElementById(`select2`).checked = '';
  document.getElementById(`select3`).checked = '';
  document.getElementById(`select4`).checked = '';
  document.getElementById(`select5`).checked = '';
  document.getElementById(`select6`).checked = '';

}

/**
 * Función que agrega un egreso para el usuario en sesión.
 */
function agregarEgreso() {
  if (validarCamposEgreso()) {
    let arregloEgreso = {
      monto: document.getElementById('monto-nuevo-egreso').value,
      categoria: document.getElementById('categoria-nuevo-egreso').value,
      fecha: document.getElementById('fecha-nuevo-egreso').value
    }

    let req = new XMLHttpRequest;
    req.onload = () => {
      if (req.readyState == 4) {
        if (req.status == 200) {
          tablaEgresos();
          cancelarEgreso();
          datosGraficaEgresos();
        }
      } else {
        console.log('Error al cargar egreso');
      }
    }

    req.open('POST', '/agregarEgreso');
    req.setRequestHeader('Content-type', 'application/json');
    req.send(JSON.stringify(arregloEgreso));
  }
}

/**
 * Función que envía el _id de un ingreso para mostrar y habilita la función para editar el ingreso.
 * Verifica si lo que quiere es editarse o eliminarse el documento.
 */
function mostrarEgreso(idEgreso, validador) {
  if (idEgreso != undefined) {
    let id = {
      id: idEgreso
    }
    let req = new XMLHttpRequest;

    req.onload = () => {
      if (req.readyState == 4) {
        if (req.status == 200) {
          let egreso = req.response.split(',');
          camposEgreso();
          document.getElementById('monto-nuevo-egreso').value = egreso[0];
          document.getElementById('categoria-nuevo-egreso').value = egreso[1];
          validarSelect(egreso[1]);
          document.getElementById('fecha-nuevo-egreso').value = egreso[2];

          if (validador == 0) {
            // Si el validador es 0, la función es para editar el egreso, por lo que se habilitan los campos
            document.getElementById('monto-nuevo-egreso').removeAttribute('disabled');
            habilitarSelects(0);
            document.getElementById('fecha-nuevo-egreso').removeAttribute('disabled');
            document.getElementById('div-boton-egreso').innerHTML = `
            <a disabled id="boton-guardar-egreso" onclick="editarEgreso('${idEgreso}')"
            class="boton-ingreso center waves-effect waves-light btn">EDITAR</a>`;
          } else {

            // De lo contrario queda todo deshabilitado, excepto el botón para eliminar el documento.
            document.getElementById('monto-nuevo-egreso').setAttribute('disabled', true);
            habilitarSelects(1);
            document.getElementById('fecha-nuevo-egreso').setAttribute('disabled', true);
            document.getElementById('div-boton-egreso').innerHTML = `
            <a id="boton-guardar-egreso" onclick="eliminarEgreso('${idEgreso}')"
            class="boton-ingreso center waves-effect waves-light btn">ELIMINAR</a>`;
          }
        }
      }
    }

    req.open('POST', '/getEgreso');
    req.setRequestHeader('Content-type', 'application/json');
    req.send(JSON.stringify(id));


  } else {
    console.log('error pedido');
  }
}

/**
 * Función que envía el id y los valores de los campos de egreso a base, para ser actualizados.
 */
function editarEgreso(idEgreso) {
  if (idEgreso != undefined) {
    // arregloDatos que será enviado al servidor
    let arregloDatos = {
      id: idEgreso,
      monto: document.getElementById('monto-nuevo-egreso').value,
      categoria: document.getElementById('categoria-nuevo-egreso').value,
      fecha: document.getElementById('fecha-nuevo-egreso').value
    }
    let req = new XMLHttpRequest;

    req.onload = () => {
      if (req.readyState == 4) {
        if (req.status == 200) {
          tablaEgresos();
          cancelarEgreso();
          datosGraficaEgresos();
        }
      }
    }

    req.open('POST', '/editarEgreso');
    req.setRequestHeader('Content-type', 'application/json');
    req.send(JSON.stringify(arregloDatos));
  }
}

/**
 * Función que solicitará vía AJAX eliminar un documento de la colección egreso, recibiendo su id.
 */
function eliminarEgreso(idEgreso) {
  if (idEgreso != undefined) {
    let id = {
      id: idEgreso
    }

    let req = new XMLHttpRequest;
    req.onload = () => {
      if (req.readyState == 4) {
        if (req.status == 200) {
          tablaEgresos();
          cancelarEgreso();
          datosGraficaEgresos();
        }
      }
    }

    req.open('POST', '/eliminarEgreso');
    req.setRequestHeader('Content-type', 'application/json');
    req.send(JSON.stringify(id));

  } else {
    console.log('error pedido');
  }
}










/**
 * Logut; destruye la sesión.
 */
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

