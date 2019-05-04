import { getMaxListeners } from "cluster";

//Dummie para Usuarios
let arrayUsers = [
  {
    id: 1,
    email: "viviana.rondon97@getMaxListeners.com",
    user: "Viviana",
    password: 123456
  },
  {
    id: 2,
    email: "vanessalazar21@gmail.com",
    user: "Vanessa",
    password: 123456
  },
  {
    id: 3,
    email: "vanessaguerra2003gmail.com",
    user: "Vanessita",
    password: 123456
  }
];



function login() {

  let xhr = new XMLHttpRequest;

  xhr.onload() = () => {

    if(xhr.status==200){
      window.location.href = xhr.responseText;

      //Acá debo revisar cual es el verdadero estado de error por credenciales

    }else if (xhr.status==300){
      document.getElementById('error-message').textContent = 'Usuario o clave inválidos';

    }else{
      document.getElementById('error-message').textContent = xhr.responseText;
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