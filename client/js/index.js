
/**
 * Función que valida todos los campos ingresados en la pantalla de login para su posterior envío al servidor
 */
function validarDatos (campo) {
  // Primero obtengo el valor del campo que estoy validando
  const valor = document.getElementById(campo).value;

  // Creo la variable del error para ambos casos, tanto para usuario registrado como para nuevo registro.
  let errorMessageDiv = document.getElementById('error-message');
  let crearErrorMessageDiv = document.getElementById('crear-error-message');

  // Valida los 3 inputs que vamos a manejar y en caso de dar error, rellena el respectivo campo de error.
  switch (campo) {
    case 'email':
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(valor)) {
      errorMessageDiv.textContent = '';
      break;
    } else{
      errorMessageDiv.textContent = 'Email inválido';
      break;
    }

    case 'new-user':
    if (/^([A-ZÁÉÍÓÚ]{1}[a-zñáéíóú]+[\s]*)+$/.test(valor)) {
      crearErrorMessageDiv.textContent = '';
      break;
    } else {
      crearErrorMessageDiv.textContent = 'Ingrese un nombre real';
      break;
    }

    case 'new-email':
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(valor)) {
      crearErrorMessageDiv.textContent = '';
      break;
    } else{
      crearErrorMessageDiv.textContent = 'Email inválido';
      break;
    }
  }
}

/**
 * Función que envía una petición a AJAX para poder validar si las credenciales de usuario
 * ingresadas son correctas. 
 */

function login() {
  // Prepara la constante del div error
  let errorMessageDiv = document.getElementById("error-message");

  // En caso de tener algún campo de ingreso vacío, rellena el campo del div error con "Debe ingresar datos"
  if (document.getElementById("email").value == '' || document.getElementById("password").value == '') {
    errorMessageDiv.textContent = 'Debe ingresar datos';
    return;
  }

  // En caso de tener algún error mostrado en pantalla, muestra "Verifique los datos" y termina la función.
  if (errorMessageDiv.textContent != '') {
    errorMessageDiv.textContent = 'Verifique los datos';
    return;
  }

  // Comprobado que los campos no sean undefined, envía la petición por medio de AJAX
  let req = new XMLHttpRequest();

  req.onload = () => {

    if (req.status == 200) {
      window.location.href = req.responseText;
    } else if (req.status == 403) {
      // 403: No autorizado
      errorMessageDiv.textContent = "Usuario o clave inválidos";
    } else {
      // Otro código HTTP
      errorMessageDiv.textContent = `Error inesperado : ${req.status}`;
    }
  }

  req.open("POST", "/login");

  let credenciales = {
    email: document.getElementById('email').value,
    password: document.getElementById('password').value
  };

  req.setRequestHeader('Content-type', 'application/json');
  req.send(JSON.stringify(credenciales));

}



/**
 * Función que envía los datos ingresados para la creación de un nuevo usuario por medio de AJAX. 
 */

function crearUsuario() {
  // Prepara la constante del div error
  let errorMessageDiv = document.getElementById("crear-error-message");

  // Toma todas las variables a enviar por medio del POST
  let user = document.getElementById("new-user").value;
  let email = document.getElementById("new-email").value;
  let password = document.getElementById("new-password").value;

  // En caso de tener algún campo de ingreso vacío, rellena el campo del div error con "Debe ingresar datos"
  if (user == '' || password == '' || email == '') {
    errorMessageDiv.textContent = 'Debe ingresar datos';
    return;
  }

  // En caso de tener algún error mostrado en pantalla, muestra "Verifique los datos" y termina la función.
  if (errorMessageDiv.textContent != '') {
    errorMessageDiv.textContent = 'Verifique los datos';
    return;
  }
    // Comprobado que los campos no sean undefined, envía la petición por medio de AJAX
    let req = new XMLHttpRequest();

    req.onload = () => {

      if (req.status == 200) {
        window.location.href = req.responseText;
      } else if (req.status == 403) {
        // 403: No autorizado
        errorMessageDiv.textContent = "Usuario ya registrado";
      } else {
        // Otro código HTTP
        errorMessageDiv.textContent = `Error inesperado : ${req.status}`;
      }
    }

    req.open("POST", "/crearUsuario");

    let credenciales = {
      user: user,
      email: email,
      password: password
    };

    req.setRequestHeader('Content-type', 'application/json');
    req.send(JSON.stringify(credenciales));

}