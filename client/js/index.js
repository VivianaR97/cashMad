/**
 * Función que almacena envía una petición a AJAX para poder validar si las credenciales de usuario
 * ingresadas son correctas. 
 */

function login() {
  // Prepara la constante del div error
  const errorMessageDiv = document.getElementById("error-message");
  errorMessageDiv.textContent = '';

  // En caso de tener algún campo de ingreso vacío, rellena el campo del div error con "Debe ingresar datos"
  if (document.getElementById("user").value == '' || document.getElementById("password").value == ''){
    errorMessageDiv.textContent = 'Debe ingresar datos';
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
    user: document.getElementById("user").value,
    password: document.getElementById("password").value
  };

  req.setRequestHeader('Content-type', 'application/json');
  req.send(JSON.stringify(credenciales));

}