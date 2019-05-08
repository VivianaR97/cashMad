// Exporto las dos funciones en el objeto module.exports
module.exports.getUser = getUser;

// Librería de mongodb
const mongodb = require('mongodb');

// MongoClient
const MongoClient = mongodb.MongoClient;

// URL y nombre de la DB
const mongoURL = 'mongodb://localhost:27017';
const dbName = "cashmad";

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
            cbError("No se pudo conectar a la DB. " + err);
        } else {

            const db = client.db(dbName);
            const collection = db.collection("usuarios");

            // Busco el documento que contenga a mi usuario en la colección "usuarios"
            collection.find({ email: user }, (err, response) => {
                // Verifico el objeto "err"
                if (err == undefined) {
                    // De no tener error, llamo al cbOk para acceder al home.
                    cbDataReady();
                } else {
                    // Error. Llamo al callback de error con el mensaje.
                    cbError("Error" + err);
                }

                // Cierro la conexión
                client.close();
            });

        }
    });
};