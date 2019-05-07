/**
 * Función que almacena los datos del usuario y los envía vía AJAX para validarlos. 
 * De estar correctos deriva al usuario al home, de lo contrario muestra un error en pantalla. 
 */

function login() {

  let req = new XMLHttpRequest();

  req.onload = () => {
    const errorMessageDiv = document.getElementById("error-message");

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