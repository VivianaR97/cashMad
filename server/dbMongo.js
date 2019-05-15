// Exporto las dos funciones en el objeto module.exports
module.exports.getUser = getUser;
module.exports.insertUser = insertUser;
module.exports.getMeta = getMeta;
module.exports.editarMeta = editarMeta;
module.exports.getIngresos = getIngresos;
module.exports.insertIngreso = insertIngreso;
module.exports.getIngreso = getIngreso;
module.exports.editarIngreso = editarIngreso;
module.exports.eliminarIngreso = eliminarIngreso;
module.exports.getGraficaIngresos = getGraficaIngresos;
module.exports.getEgresos = getEgresos;
module.exports.insertEgreso = insertEgreso;
module.exports.getEgreso = getEgreso;
module.exports.editarEgreso = editarEgreso;
module.exports.eliminarEgreso = eliminarEgreso;
module.exports.getGraficaEgresos = getGraficaEgresos;

// Utilizo la función ObjectID
var ObjectID = require('mongodb').ObjectID;

// Librería de mongodb
const mongodb = require('mongodb');

// MongoClient
const MongoClient = mongodb.MongoClient;

// URL y nombre de la DB
const mongoURL = 'mongodb://localhost:27017';
const dbName = 'cashmad';


// <----------------- FUNCIONALIDADES SOBRE USUARIOS ----------------->
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
            if (email != undefined && password != undefined) {
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
            if (user != undefined && email != undefined && password != undefined) {
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
        }
    });
};


// <----------------- FUNCIONALIDADES SOBRE METAS ----------------->
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
            if (emailUsuario != undefined) {
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
        }
    });
};

/**
 * Función que edita el contenido de una meta existente.
 * En caso de no existir una meta asociada al usuario, la crea.
 */
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
};


// <----------------- FUNCIONALIDADES SOBRE INGRESOS ----------------->
/**
 * Función que trae los últimos 5 ingresos de un usuario, en orden descendente,
 * para ser mostrados en lista en el home.
 */
function getIngresos(emailUsuario, cbDataReady, cbError) {
    // Conexión DB
    MongoClient.connect(mongoURL, { useNewUrlParser: true }, (err, client) => {

        if (err) {
            // Error en la conexión
            cbError();
        } else {
            if (emailUsuario != undefined) {
                // Constante que apunta al nombre de mi DB.
                const db = client.db(dbName);

                // Constante que trae la colección de "ingresos".
                const collection = db.collection('ingresos');
                let arregloIngresos = '';
                // Busco si existe el documento de meta con el email de mi usuario.
                collection.find({ idUsuario: emailUsuario }).sort({ $natural: -1 }).limit(5).toArray((err, response) => {
                    // Si tiene ingresos, la reenvío al servidor.
                    if (response.length != 0) {
                        for (let i = 0; i < response.length; i++) {
                            arregloIngresos += `${response[i]._id};${response[i].monto};${response[i].descripcion},`;
                        }
                        cbDataReady(arregloIngresos);
                    } else {
                        cbDataReady();
                    }

                    // Cierro la conexión 
                    client.close();
                });
            }
        }
    });
};

/**
 * Función que Inserta un nuevo ingreso.
 */
function insertIngreso(email, monto, descripcion, fecha, cbDataReady, cbError) {

    // Conexión DB
    MongoClient.connect(mongoURL, { useNewUrlParser: true }, (err, client) => {

        if (err) {
            // Error en la conexión
            cbError(err);
        } else {
            if (email != undefined && monto != undefined && descripcion != undefined && fecha != undefined) {
                // Constante que apunta al nombre de mi DB.
                const db = client.db(dbName);

                // Constante que trae la colección de "ingresos".
                const collection = db.collection('ingresos');

                // Inserto un nuevo documento con los valores enviados desde el cliente. 
                collection.insertOne({
                    idUsuario: email,
                    monto: monto,
                    descripcion: descripcion,
                    fecha: fecha
                });
                cbDataReady();

                // Cierro la conexión
                client.close();
            }
        }
    });
};

/**
 * Función que trae la información de un ingreso según su ID.
 */
function getIngreso(_idIngreso, cbDataReady, cbError) {

    // Conexión DB
    MongoClient.connect(mongoURL, { useNewUrlParser: true }, (err, client) => {

        if (err) {
            // Error en la conexión
            cbError(err);
        } else {
            if (_idIngreso != undefined) {
                // Constante que apunta al nombre de mi DB.
                const db = client.db(dbName);

                // Constante que trae la colección de "ingresos".
                const collection = db.collection('ingresos');

                // Busco el documento de ingreso por su id y tomo los datos a mostrar. 
                collection.find({ _id: ObjectID(_idIngreso) }).toArray((err, response) => {
                    if (response.length == 1) {
                        let arrayIngreso = `${response[0].monto},${response[0].descripcion},${response[0].fecha}`
                        // Callback OK.
                        cbDataReady(arrayIngreso);
                    } else {
                        // Callback error.
                        cbError();
                    }
                });

                // Cierro la conexión
                client.close();
            }
        }
    });
};

/**
 * Función que toma el id de un ingreso y actualiza sus datos con todos los parámetros indexados.
 */
function editarIngreso(_idIngreso, monto, descripcion, fecha, cbDataReady, cbError) {
    // Conexión DB
    MongoClient.connect(mongoURL, { useNewUrlParser: true }, (err, client) => {

        if (err) {
            // Error en la conexión
            cbError();
        } else {
            if (_idIngreso != undefined && monto != undefined && descripcion != undefined && fecha != undefined) {
                // Constante que apunta al nombre de mi DB.
                const db = client.db(dbName);
                // Constante que trae la colección "ingresos".
                const collection = db.collection('ingresos');
                // Busco si existe el documento con el id requerido y lo actualizo.
                collection.updateOne({ _id: ObjectID(_idIngreso) },
                    {
                        $set: {
                            monto: monto,
                            descripcion: descripcion,
                            fecha: fecha
                        }
                    });
                // Callback OK.
                cbDataReady();
            } else {
                // Callback error.
                cbError();
            }

        }
    });
};

/**
 * Función que recibe el id de un ingreso y lo elimina.
 */
function eliminarIngreso(_idIngreso, cbDataReady, cbError) {
    // Conexión DB
    MongoClient.connect(mongoURL, { useNewUrlParser: true }, (err, client) => {

        if (err) {
            // Error en la conexión
            cbError();
        } else {
            if (_idIngreso != undefined) {
                // Constante que apunta al nombre de mi DB.
                const db = client.db(dbName);
                // Constante que trae la colección "ingresos".
                const collection = db.collection('ingresos');

                // Busco si existe el documento con el id requerido y lo elimino.
                collection.deleteOne({ _id: ObjectID(_idIngreso) });

                // Callback OK.
                cbDataReady();
            } else {
                // Callback error.
                cbError();
            }

        }
    });
};

/**
 * Función que recibe el email del usuario en sesión y envía sus 30 últimos registros de ingresos.
 */
function getGraficaIngresos(emailUsuario, cbDataReady, cbError) {
    // Conexión DB
    MongoClient.connect(mongoURL, { useNewUrlParser: true }, (err, client) => {

        if (err) {
            // Error en la conexión
            cbError();
        } else {
            if (emailUsuario != undefined) {
                let arregloIngresos = '';
                // Constante que apunta al nombre de mi DB.
                const db = client.db(dbName);
                // Constante que trae la colección "ingresos".
                const collection = db.collection('ingresos');

                // Busco en la colección de ingresos los últimos 30 documentos para el usuario indexado.            
                collection.find({ idUsuario: emailUsuario }).limit(30).toArray((err, response) => {

                    if (response.length != 0) {
                        for (let i = 0; i < response.length; i++) {
                            var fechaSeparada = response[i].fecha.split('/');
                            arregloIngresos += `${response[i].monto};${fechaSeparada[1]},`;
                        }
                        cbDataReady(arregloIngresos);
                    } else {
                        cbError();
                        return;
                    }
                });

            } else {
                // Callback error.
                cbError();
            }

        }
    });
}






// <----------------- FUNCIONALIDADES SOBRE EGRESOS ----------------->
/**
 * Función que trae los últimos 5 egresos de un usuario, en orden descendente,
 * para ser mostrados en lista en el home.
 */
function getEgresos(emailUsuario, cbDataReady, cbError) {
    // Conexión DB
    MongoClient.connect(mongoURL, { useNewUrlParser: true }, (err, client) => {

        if (err) {
            // Error en la conexión
            cbError();
        } else {
            if (emailUsuario != undefined) {
                // Constante que apunta al nombre de mi DB.
                const db = client.db(dbName);

                // Constante que trae la colección de "egresos".
                const collection = db.collection('egresos');
                let arregloEgresos = '';
                // Busco si existe el documento de meta con el email de mi usuario.
                collection.find({ idUsuario: emailUsuario }).sort({ $natural: -1 }).limit(5).toArray((err, response) => {
                    // Si tiene ingresos, la reenvío al servidor.
                    if (response.length != 0) {
                        for (let i = 0; i < response.length; i++) {
                            arregloEgresos += `${response[i]._id};${response[i].monto};${response[i].categoria},`;
                        }
                        cbDataReady(arregloEgresos);
                    } else {
                        cbDataReady();
                    }

                    // Cierro la conexión 
                    client.close();
                });
            }
        }
    });
};

/**
 * Función que Inserta un nuevo egreso.
 */
function insertEgreso(email, monto, categoria, fecha, cbDataReady, cbError) {

    // Conexión DB
    MongoClient.connect(mongoURL, { useNewUrlParser: true }, (err, client) => {

        if (err) {
            // Error en la conexión
            cbError(err);
        } else {
            if (email != undefined && monto != undefined && categoria != undefined && fecha != undefined) {
                // Constante que apunta al nombre de mi DB.
                const db = client.db(dbName);

                // Constante que trae la colección de "egresos".
                const collection = db.collection('egresos');

                // Inserto un nuevo documento con los valores enviados desde el cliente. 
                collection.insertOne({
                    idUsuario: email,
                    monto: monto,
                    categoria: categoria,
                    fecha: fecha
                });
                cbDataReady();

                // Cierro la conexión
                client.close();
            }
        }
    });
};

/**
 * Función que trae la información de un egreso según su ID.
 */
function getEgreso(_idEgreso, cbDataReady, cbError) {

    // Conexión DB
    MongoClient.connect(mongoURL, { useNewUrlParser: true }, (err, client) => {

        if (err) {
            // Error en la conexión
            cbError(err);
        } else {
            if (_idEgreso != undefined) {
                // Constante que apunta al nombre de mi DB.
                const db = client.db(dbName);

                // Constante que trae la colección de "egresos".
                const collection = db.collection('egresos');

                // Busco el documento de ingreso por su id y tomo los datos a mostrar. 
                collection.find({ _id: ObjectID(_idEgreso) }).toArray((err, response) => {
                    if (response.length == 1) {
                        let arrayEgreso = `${response[0].monto},${response[0].categoria},${response[0].fecha}`
                        // Callback OK.
                        cbDataReady(arrayEgreso);
                    } else {
                        // Callback error.
                        cbError();
                    }
                });

                // Cierro la conexión
                client.close();
            }
        }
    });
};

/**
 * Función que toma el id de un egreso y actualiza sus datos con todos los parámetros indexados.
 */
function editarEgreso(_idEgreso, monto, categoria, fecha, cbDataReady, cbError) {
    // Conexión DB
    MongoClient.connect(mongoURL, { useNewUrlParser: true }, (err, client) => {

        if (err) {
            // Error en la conexión
            cbError();
        } else {
            if (_idEgreso != undefined && monto != undefined && categoria != undefined && fecha != undefined) {
                // Constante que apunta al nombre de mi DB.
                const db = client.db(dbName);
                // Constante que trae la colección "egresos".
                const collection = db.collection('egresos');
                // Busco si existe el documento con el id requerido y lo actualizo.
                collection.updateOne({ _id: ObjectID(_idEgreso) },
                    {
                        $set: {
                            monto: monto,
                            categoria: categoria,
                            fecha: fecha
                        }
                    });
                // Callback OK.
                cbDataReady();
            } else {
                // Callback error.
                cbError();
            }

        }
    });
};

/**
 * Función que recibe el id de un egreso y lo elimina.
 */
function eliminarEgreso(_idEgreso, cbDataReady, cbError) {
    // Conexión DB
    MongoClient.connect(mongoURL, { useNewUrlParser: true }, (err, client) => {

        if (err) {
            // Error en la conexión
            cbError();
        } else {
            if (_idEgreso != undefined) {
                // Constante que apunta al nombre de mi DB.
                const db = client.db(dbName);
                // Constante que trae la colección "ingresos".
                const collection = db.collection('egresos');

                // Busco si existe el documento con el id requerido y lo elimino.
                collection.deleteOne({ _id: ObjectID(_idEgreso) });

                // Callback OK.
                cbDataReady();
            } else {
                // Callback error.
                cbError();
            }

        }
    });
};

/**
 * Función que recibe el email del usuario en sesión y envía sus 30 últimos registros de egresos.
 */
function getGraficaEgresos(emailUsuario, cbDataReady, cbError) {
    // Conexión DB
    MongoClient.connect(mongoURL, { useNewUrlParser: true }, (err, client) => {

        if (err) {
            // Error en la conexión
            cbError();
        } else {
            if (emailUsuario != undefined) {
                let arregloEgresos = '';
                // Constante que apunta al nombre de mi DB.
                const db = client.db(dbName);
                // Constante que trae la colección "egresos".
                const collection = db.collection('egresos');

                // Busco en la colección de egresos los últimos 30 documentos para el usuario indexado.
                collection.find({ idUsuario: emailUsuario }).limit(30).toArray((err, response) => {

                    if (response.length != 0) {
                        for (let i = 0; i < response.length; i++) {
                            arregloEgresos += `${response[i].monto};${response[i].categoria},`;
                        }
                        cbDataReady(arregloEgresos);
                    } else {
                        cbError();
                        return;
                    }
                });

            } else {
                // Callback error.
                cbError();
            }

        }
    });
}