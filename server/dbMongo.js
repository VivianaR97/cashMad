// Exporto las dos funciones en el objeto module.exports
module.exports.getUser = getUser;

// Librería de mongodb
const mongodb = require('mongodb');

// MongoClient
const MongoClient = mongodb.MongoClient;

// URL y nombre de la DB
const mongoURL = 'mongodb://localhost:27017';
const dbName = 'cashmad';

/**
 * Esta función hace un find() en la DB para encontrar coincidencias de los parámetros
 * user y password en la colección de usuarios. En caso de validación envía cbDataReady() 
 * para redirigir al usuario al home; de lo contrario envía error.
 */
function getUser(user, password, cbDataReady, cbError) {
    // Conexión DB
    MongoClient.connect(mongoURL, { useNewUrlParser: true }, (err, client) => {

        if (err) {
            // Error en la conexión
            cbError();
        } else {
            // Constante que apunta al nombre de mi DB.
            const db = client.db(dbName);
            
            // Constante que trae la colección de "usuarios".
            const collection = db.collection('usuarios');
            
            // Busco el documento que contenga a mi usuario en la colección "usuarios"
            collection.find({ 'email': user }).toArray((err, response) => {

                // Verifico que la contraseña del usuario en DB corresponda con la ingresada en la web.
                if(response.password == password){
                    // Usuario verificado exitosamente.
                    cbDataReady();
                } else {
                    // Error. Llamo al callback de error que me muestra inválida la consulta.
                    cbError(403);
                }

                // Cierro la conexión
                client.close();
            });
        }
    });
};