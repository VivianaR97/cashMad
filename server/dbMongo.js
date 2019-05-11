// Exporto las dos funciones en el objeto module.exports
module.exports.getUser = getUser;
module.exports.insertUser = insertUser;
module.exports.getMeta = getMeta;
module.exports.editarMeta = editarMeta;

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
function getUser(email, password, cbDataReady, cbError) {
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

            // Busco el documento que contenga a mi usuario con su contraseña en la colección "usuarios".
            collection.find({ email: email, password: password }).toArray((err, response) => {
                // Si mi respuesta me trae datos entro al cbDataReady.
                if (response.length == 1) {
                    // Usuario verificado exitosamente.
                    cbDataReady();
                } else {
                    // Error. Llamo al callback de error que me muestra inválida la consulta.
                    cbError();
                }


                // Cierro la conexión
                client.close();
            });
        }
    });
};


/**
 * Esta función hace un find() en la DB para encontrar coincidencias de los parámetros
 * user y password en la colección de usuarios. En caso de validación envía cbDataReady() 
 * para redirigir al usuario al home; de lo contrario envía error.
 */
function insertUser(user, email, password, cbDataReady, cbError) {

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

            // Busco si el usuario ya está registrado.
            collection.find({ 'email': email }).toArray((err, response) => {
                // Si el usuario ya está registrado, envía error.
                if (response.length != 0) {
                    // Usuario verificado exitosamente.
                    cbError();
                } else {
                    collection.insertOne({
                        nombre: user,
                        email: email,
                        password: password
                    });
                    // Error. Llamo al callback de error que me muestra inválida la consulta.
                    cbDataReady();
                }

                // Cierro la conexión
                client.close();
            });
        }
    });
};


/**
 *Función que recibe el email de un usuario y busca en la colección de metas el documento que le pertenezca
 */
function getMeta(emailUsuario, cbDataReady, cbError) {
    // Conexión DB
    MongoClient.connect(mongoURL, { useNewUrlParser: true }, (err, client) => {

        if (err) {
            // Error en la conexión
            cbError();
        } else {
            // Constante que apunta al nombre de mi DB.
            const db = client.db(dbName);

            // Constante que trae la colección de "metas".
            const collection = db.collection('metas');

            // Busco si existe el documento de meta con el email de mi usuario.
            collection.find({ idUsuario: emailUsuario }).toArray((err, response) => {
                // Si tiene meta, la reenvío al servidor.
                if (response.length == 1) {
                    let arregloMeta = `${response[0].nombre}, ${response[0].objetivo}, ${response[0].fechaInicio}`;
                    cbDataReady(arregloMeta);
                } else if (response.length == 0) {
                    // En caso de no tener meta, reenvío vacía la respuesta.
                    cbDataReady(false);
                } else {
                    cbError();
                }


                // Cierro la conexión
                client.close();
            });
        }
    });
};

function editarMeta(emailUsuario, nombre, objetivo, fecha, cbDataReady, cbError) {
    // Conexión DB
    MongoClient.connect(mongoURL, { useNewUrlParser: true }, (err, client) => {

        if (err) {
            // Error en la conexión
            cbError();
        } else {
            if (emailUsuario != undefined && nombre != undefined && objetivo != undefined && fecha != undefined) {
                // Constante que apunta al nombre de mi DB.
                const db = client.db(dbName);

                // Constante que trae la colección "metas".
                const collection = db.collection('metas');

                // Busco si existe el documento con el email del usuario,
                // en caso de existir actualizo, de lo contrario lo creo.
                collection.updateOne({ idUsuario: emailUsuario },
                    {
                        $set: {
                            nombre: nombre,
                            objetivo: objetivo,
                            fechaInicio: fecha
                        }
                    }, {
                        upsert: true
                    });
                cbDataReady();
            } else {
                cbError();
            }

        }
    })
}