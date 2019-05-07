//Dummie para Usuarios
let arrayUsers = [
    {
        id: 1,
        email: "admin1",
        user: "Viviana",
        password: "admin1"
    },
    {
        id: 2,
        email: "admin2",
        user: "Vanessa",
        password: "admin2"
    },
    {
        id: 3,
        email: "admin3",
        user: "Vanessita",
        password: "admin3"
    }
];

/**
 * Esta función recibe un usuario y contraseña, recorre el arrayUsers buscando la coindicencia del user
 * con el email. Cuando la consiga, valida si en el mismo id, la contraseña ingresada corresponde.
 * Si las credenciales son validadas correctamente devuelve true, de lo contrario, retorna false.
 */
function validarUsuario(user, password) {
    for (let i = 0; i < arrayUsers.length; i++) {
        if (user == arrayUsers[i].email) {
            if (password === arrayUsers[i].password){
                return true;
            }
            else {
                return false;
            }
        } 
    }
}

module.exports.validarUsuario = validarUsuario;